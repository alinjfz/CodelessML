import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from app.train.utils import validate_train

def train_svm_model(file_name, target_column, feature_columns = None, test_size=0.2, random_state=42, hyper_parameters = None):
    # Validate inputs
    is_valid, message, features = validate_train(file_name, target_column, feature_columns, test_size, random_state)
    kernel = 'rbf'
    if (hyper_parameters and 'kernel' in hyper_parameters):
        kernel = hyper_parameters['kernel']
    if is_valid:
        # Load dataset
        df = pd.read_csv(file_name)
        feature_columns = features
        # Separate features and target
        X = df[feature_columns]
        y = df[target_column]

        # Split dataset into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)
        try:
            # Train SVM model
            svm_model = SVC(kernel=kernel)
            svm_model.fit(X_train, y_train)

            # Make predictions
            y_pred = svm_model.predict(X_test)

            # Calculate accuracy
            accuracy = accuracy_score(y_test, y_pred)

            # Use decision_function to get signed distances
            decision_values = svm_model.decision_function(X_test)
            # Calculate a cost-like value based on the decision values
            cost_value = None
            if len(decision_values) > 0:
                cost_value =  abs(sum(decision_values) / len(decision_values))
            return True, {'message': 'SVM model trained successfully', 'accuracy': accuracy, 'cost': cost_value}, svm_model, features
        except Exception as e:
            return False, {"error" : str(e)}
    return False, {'message' : message }