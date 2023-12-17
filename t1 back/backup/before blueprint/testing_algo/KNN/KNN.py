'''
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import tensorflow as tf


# Load dataset
df = pd.read_csv('dataset.csv')

# Define input features and output column
X = df.drop('output_column', axis=1)
y = df['output_column']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Build and train the KNN model using TensorFlow
knn_model = KNeighborsClassifier(n_neighbors=5)
knn_model.fit(X_train, y_train)

# Save the trained model
model_filename = 'knn_model.h5'
tf.keras.models.save_model(knn_model, model_filename)

@app.route('/get_accuracy', methods=['GET'])
def get_accuracy():
    # Load the dataset for evaluation
    df = pd.read_csv('dataset.csv')

    # Define input features and output column
    X = df.drop('output_column', axis=1)
    y = df['output_column']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Standardize the features
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Load the trained model
    model_filename = 'knn_model.h5'
    knn_model = tf.keras.models.load_model(model_filename)

    # Evaluate accuracy on the test set
    accuracy = knn_model.score(X_test, y_test)

    return jsonify({'accuracy': accuracy})

'''



'''
from flask import Flask, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import tensorflow as tf

app = Flask(__name__)

# Initialize variables for the model and scaler
knn_model = None
scaler = None

@app.route('/train_and_get_accuracy', methods=['GET'])
def train_and_get_accuracy():
    global knn_model, scaler

    # Load dataset
    df = pd.read_csv('dataset.csv')

    # Define input features and output column
    X = df.drop('output_column', axis=1)
    y = df['output_column']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Standardize the features
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Build and train the KNN model using TensorFlow
    knn_model = KNeighborsClassifier(n_neighbors=5)
    knn_model.fit(X_train, y_train)

    # Evaluate accuracy on the test set
    accuracy = knn_model.score(X_test, y_test)

    return jsonify({'accuracy': accuracy})

@app.route('/predict', methods=['POST'])
def predict():
    global knn_model, scaler

    data = request.get_json()

    # Ensure that the input data has the correct format
    if 'features' not in data:
        return jsonify({'error': 'Missing features'}), 400

    features = data['features']

    # Standardize the input features
    standardized_features = scaler.transform([features])

    # Make a prediction using the trained model
    prediction = knn_model.predict(standardized_features)[0]

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)


'''