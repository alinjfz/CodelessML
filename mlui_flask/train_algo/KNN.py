from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

def train_knn_model(file_name, target_column, feature_columns = None, k_neighbors = 3, test_size=0.2, random_state=42):
    # Validate inputs
    if not file_name or not target_column or not k_neighbors:
        return jsonify({'error': 'Missing required parameters'})

    # Load dataset
    try:
        df = pd.read_csv(file_name)
    except Exception as e:
        return jsonify({'error': f'Error loading dataset: {str(e)}'})

    # Validate target column
    if target_column not in df.columns:
        return jsonify({'error': f'Target column "{target_column}" not found in dataset'})

    # If feature_columns is not provided, use all columns as features
    if feature_columns is None:
        feature_columns = [col for col in df.columns if col != target_column]

    # Validate feature columns
    for feature_column in feature_columns:
        if feature_column not in df.columns:
            return jsonify({'error': f'Feature column "{feature_column}" not found in dataset'})

    # Separate features and target
    X = df[feature_columns]
    y = df[target_column]

    # Split dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    # Train KNN model
    knn_model = KNeighborsClassifier(n_neighbors=k_neighbors)
    knn_model.fit(X_train, y_train)

    # Make predictions
    y_pred = knn_model.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    return jsonify({'message': 'KNN model trained successfully.', 'accuracy': accuracy}), 200

@app.route('/train/knn', methods=['POST'])
def train_model():
    # Get parameters from the request
    data = request.get_json()
    if ('file_name' in data and 'target_column' in data):
        file_name = data['file_name']
        target_column = data['target_column']
        feature_columns = None
        if ('feature_columns' in data)
            feature_columns = data.getlist('feature_columns')
        k_neighbors = 3
        if ('k_neighbors' in data)
            k_neighbors = data['k_neighbors']
        test_size=0.2
        if ('test_size' in data)
            test_size = data['test_size']
        random_state=42
        if ('random_state' in data)
            random_state = data['random_state']
        # Extract user data from the JSON request
        return train_knn_model(file_name, target_column, feature_columns, k_neighbors, test_size, random_state)

    return jsonify({'error': 'Missing required parameters'})