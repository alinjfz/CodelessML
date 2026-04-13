from flask import json, jsonify, request
from flask_login import current_user
import numpy as np
import pandas as pd
from app.uploader.utils import check_file_is_available_return_path
from app.models import FileStorage, db, Algorithm, TrainingHistory
from datetime import datetime
from joblib import dump, load
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import os


def compute_metrics(y_test, y_pred):
    return {
        'accuracy': round(float(accuracy_score(y_test, y_pred)), 4),
        'precision': round(float(precision_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
        'recall': round(float(recall_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
        'f1': round(float(f1_score(y_test, y_pred, average='weighted', zero_division=0)), 4),
        'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
    }

def validate_train(file_name, target_column, feature_columns, test_size, random_state):
    # Validate inputs
    if not file_name or not target_column or not test_size or not random_state:
        return False, 'Missing required parameters'
    # Load dataset
    try:
        df = pd.read_csv(file_name)
    except Exception as e:
        return False, f'Error loading dataset: {str(e)}'

    # Validate target column
    if target_column not in df.columns:
        return False, f'Target column {target_column} not found in dataset'

    # If feature_columns is not provided, use all columns as features
    if feature_columns is None:
        feature_columns = [col for col in df.columns if col != target_column]

    # Validate feature columns
    for feature_column in feature_columns:
        if feature_column not in df.columns:
            return False, f'Feature column {feature_column} not found in dataset'
        
    return True, None, feature_columns

def get_data_from_api(data):
    if ('dataset_id' in data and 'target_column' in data):
        target_data = { 'dataset_id' : data['dataset_id'] ,  'target_column' : data['target_column']}
        target_data['feature_columns'] = None
        if ('feature_columns' in data):
            target_data['feature_columns'] = data['feature_columns']
        target_data['test_size'] = 0.2
        if ('test_size' in data):
            target_data['test_size'] = float(data['test_size'])
        target_data['random_state'] = 42
        if ('random_state' in data):
            target_data['random_state'] = int(data['random_state'])
        target_data['hyper_parameters'] = {}
        for x in data:
            if (not x in target_data):
                target_data['hyper_parameters'][x] = data[x]  
        file_is_ok, file_data = check_file_is_available_return_path(target_data['dataset_id'], current_user.id)
        if (file_is_ok):
            target_data['file_name'] = file_data
        else:
            return False, file_data
        return True, target_data
    return False, {'error' : 'Missing required parameters'}

def add_to_train_db(data, model):
    try:
        features = json.dumps(data['feature_columns'])
        trained_model = TrainingHistory(
            data['user_id'], data['dataset_id'], data['algo_id'],
            data['target_column'], features, data['accuracy'],
            None, data['hyper_parameters'], data['cost'],
            metrics=data.get('metrics')
        )
        db.session.add(trained_model)
        db.session.commit()
        train_id = trained_model.get_id()
        save_model(model,trained_model.get_file_dir(), trained_model.get_file_dir()+trained_model.model_filename())
        trained_model.update_model_path()
        db.session.commit()
        return True, train_id
    except Exception as e:
        return False, str(e)
    
def train_model_api(data, algorithm_name, train_function):
    algo = Algorithm.query.filter_by(name=algorithm_name).first()
    if (not current_user or not current_user.id):
        return jsonify({'error': 'Please login first'}), 403
    user_id = current_user.id
    if (not algo):
        return jsonify({'error': 'Algorithm not available'}), 400
    if (not 'dataset_id' in data):
        return jsonify({'error': 'Dataset_id not available'}), 400
    status, target_data = get_data_from_api(data)
    if (status):
        #target_data get file name from dataset table
        train_status, train_answer, model, features = train_function(target_data['file_name'], target_data['target_column'], target_data['feature_columns'], target_data['test_size'], target_data['random_state'], target_data['hyper_parameters'])
        
        if (train_status and train_answer and train_answer['accuracy']):
            # add to db
            db_stat, train_id = add_to_train_db({'user_id' : user_id, 'algo_id' : algo.id, **target_data, **train_answer, 'feature_columns':features }, model)
            if (db_stat):
                return jsonify({**train_answer, 'train_id' : train_id }), 200
            return jsonify({'error': "database error", "err" : train_id}), 400
        return jsonify({'error': train_answer}), 400
    return jsonify({'error': target_data}), 400

def save_model(model, dir_name, file_name):
    os.makedirs(dir_name, exist_ok=True)
    dump(model, file_name)
    # Load the saved Decision Tree model

def get_abs_path(path):
    app_root = os.path.dirname(os.path.abspath("app"))
    return os.path.join(app_root, path)

def load_model(train_id, user_id):
    # we should return load_stat, model, train_data
    train_data = TrainingHistory.query.filter_by(id=train_id).first()
    if (not train_data or not train_data.model_path):
        return False, jsonify({"error": "Model not found"})
    if (train_data.user_id != user_id):
        return False, jsonify({"error": "Model not accessible"})
    try:
        loaded_dt_model = load(get_abs_path(train_data.model_path))
    except (TypeError, AttributeError):
        return False, jsonify({"error": "Couldn't load model"})
    return True, loaded_dt_model, train_data

def predict_with_model(model, train_data, user_data):
    trained_feature = train_data.get_feature_columns()
    if (not trained_feature):
        trained_feature = 0
    # Validate feature columns
    for col in trained_feature:
        if col not in user_data:
            return False, f'Feature column {col} not found in dataset'
    numeric_input_data = {key: float(value) for key, value in user_data.items()}
    input_array = np.array([[numeric_input_data[feature] for feature in trained_feature]])
    prediction = model.predict(input_array)
    return True, float(prediction[0])