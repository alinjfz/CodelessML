import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from app.train.utils import validate_train, compute_metrics

def train_knn_model(file_name, target_column, feature_columns = None, test_size=0.2, random_state=42, hyper_parameters = None):
    # Validate inputs
    is_valid, message, features = validate_train(file_name, target_column, feature_columns, test_size, random_state)
    k_neighbors = 3
    if (hyper_parameters and 'k_neighbors' in hyper_parameters):
        k_neighbors = int(hyper_parameters['k_neighbors'])
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
            # Train KNN model
            knn_model = KNeighborsClassifier(n_neighbors=k_neighbors)
            knn_model.fit(X_train, y_train)

            # Make predictions
            y_pred = knn_model.predict(X_test)

            metrics = compute_metrics(y_test, y_pred)
            return True, {'message': 'KNN model trained successfully', **metrics, 'cost': None}, knn_model, features
        except Exception as e:
            return False, {"error" : str(e)}, False, False
    return False, {'message' : message }, False, False