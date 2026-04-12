import pandas as pd
from sklearn.model_selection import train_test_split
from app.train.utils import validate_train, compute_metrics
from sklearn.tree import DecisionTreeClassifier

def train_decision_tree_model(file_name, target_column, feature_columns = None, test_size=0.2, random_state=42, hyper_parameters = None):
    # Validate inputs
    is_valid, message, features = validate_train(file_name, target_column, feature_columns, test_size, random_state)
    max_depth = None
    if (hyper_parameters and 'max_depth' in hyper_parameters):
        max_depth = int(hyper_parameters['max_depth'])
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
            # Create and train the Decision Tree model
            dt_model = DecisionTreeClassifier(max_depth=max_depth)
            dt_model.fit(X_train, y_train)

            # Make predictions on the test set
            y_pred = dt_model.predict(X_test)

            metrics = compute_metrics(y_test, y_pred)
            return True, {'message': 'Decision Tree model trained successfully', **metrics, 'cost': None}, dt_model, features
        except Exception as e:
            return False, {"error" : str(e)}
    return False, {'message' : message }