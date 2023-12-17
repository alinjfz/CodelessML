from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

# Dummy DataFrame for illustration purposes
# Replace this with your actual data loading logic
data = {
    'feature_1': [1, 2, 3, 4, 5],
    'feature_2': [2, 3, 4, 5, 6],
    'target': [0, 0, 1, 1, 1]
}

df = pd.DataFrame(data)

# Default feature columns (if not provided in the request)
default_feature_columns = ['feature_1', 'feature_2']

def train_decision_tree(file_name, target_column, feature_columns=None, max_depth=None, test_size=0.2, random_state=42):
    if not file_name or not target_column:
        return jsonify({'error': 'Missing required parameters'})
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

    # Split the data into features and target
    X = df[feature_columns]
    y = df[target_column]

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    # Create and train the Decision Tree model
    model = DecisionTreeClassifier(max_depth=max_depth)
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    return jsonify({'message': 'Decision Tree model trained successfully.', 'accuracy': accuracy}), 200

@app.route('/train/decision_tree', methods=['POST'])
def train_decision_tree_api():
    data = request.get_json()
    if ('file_name' in data and 'target_column' in data):
        file_name = data['file_name']
        target_column = data['target_column']
        feature_columns = None
        if ('feature_columns' in data):
            feature_columns = data.getlist('feature_columns')
        max_depth = None
        if ('max_depth' in data):
            max_depth = data['max_depth']
        test_size = data.get('test_size', 0.2)
        random_state = data.get('random_state', 42)
        
        # Train the Decision Tree model
        return train_decision_tree(file_name, target_column, feature_columns, max_depth, test_size, random_state)
    return jsonify({'error': 'Missing required parameters'})