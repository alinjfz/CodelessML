from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

def train_svm_model(file_name, target_column, feature_columns=None, kernel='rbf',test_size=0.2, random_state=42):
    # Validate inputs
    if not file_name or not target_column:
        return jsonify({'error': 'Missing required parameters'}), 400

    # Load dataset
    try:
        df = pd.read_csv(file_name)
    except Exception as e:
        return jsonify({'error': f'Error loading dataset: {str(e)}'}), 400

    # Validate target column
    if target_column not in df.columns:
        return jsonify({'error': f'Target column "{target_column}" not found in dataset'}), 400

    # If feature_columns is not provided, use all columns as features
    if feature_columns is None:
        feature_columns = [col for col in df.columns if col != target_column]

    # Validate feature columns
    for feature_column in feature_columns:
        if feature_column not in df.columns:
            return jsonify({'error': f'Feature column "{feature_column}" not found in dataset'}), 400

    # Separate features and target
    X = df[feature_columns]
    y = df[target_column]

    # Split dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    # Train SVM model
    svm_model = SVC(kernel=kernel)
    svm_model.fit(X_train, y_train)

    # Make predictions
    y_pred = svm_model.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    return jsonify({'message': 'SVM model trained successfully.', 'accuracy': accuracy}), 200

@app.route('/train/svm', methods=['POST'])
def train_svm():
    data = request.get_json()
    # Get parameters from the request
    if ('file_name' in data and 'target_column' in data):
        file_name = data['file_name']
        target_column = data['target_column']
        feature_columns = None
        if ('feature_columns' in data):
            feature_columns = data.getlist('feature_columns')
        kernel = 'rbf'
        if ('kernel' in data):
            kernel = data['kernel']
        return train_svm_model(file_name, target_column, feature_columns, kernel)
    return jsonify({'error': 'Missing required parameters'})