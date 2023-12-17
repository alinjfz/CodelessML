from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

data = {
    'feature_1': [1, 2, 3, 4, 5],
    'feature_2': [2, 3, 4, 5, 6],
    'target': [0, 0, 1, 1, 1]
}

df = pd.DataFrame(data)

# Default feature columns (if not provided in the request)
default_feature_columns = ['feature_1', 'feature_2']

def train_random_forest(file_name, target_column, feature_columns, n_estimators=100, max_depth=None, test_size=0.2, random_state=42):
    # If a file_name is provided, load the data from the file
    if file_name:
        # Replace this with your actual data loading logic
        # Example assumes a CSV file
        df = pd.read_csv(file_name)

    # Split the data into features and target
    X = df[feature_columns]
    y = df[target_column]

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    # Create and train the Random Forest model
    model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth)
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    return model, accuracy

@app.route('/train_random_forest', methods=['POST'])
def train_random_forest_api():
    # Get data from the request
    data = request.get_json()

    # Get parameters from the request
    file_name = data.get('file_name', None)
    target_column = data.get('target_column', None)
    feature_columns = data.get('feature_columns', default_feature_columns)
    n_estimators = data.get('n_estimators', 100)
    max_depth = data.get('max_depth', None)
    test_size = data.get('test_size', 0.2)
    random_state = data.get('random_state', 42)

    # Train the Random Forest model
    try:
        model, accuracy = train_random_forest(file_name, target_column, feature_columns, n_estimators, max_depth, test_size, random_state)
        return jsonify({'message': f'Random Forest model trained successfully. Accuracy: {accuracy:.2f}'}), 200

    except ValueError as ve:
        return jsonify({'error': str(ve)}), 500
