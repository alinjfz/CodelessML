'''
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import joblib

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

# Build and train the Linear Regression model
linear_regression_model = LinearRegression()
linear_regression_model.fit(X_train, y_train)

# Save the trained model and scaler
model_filename = 'linear_regression_model.pkl'
joblib.dump(linear_regression_model, model_filename)

scaler_filename = 'scaler.pkl'
joblib.dump(scaler, scaler_filename)





from flask import Flask, jsonify, request
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Initialize variables for the model and scaler
linear_regression_model = None
scaler = None

@app.route('/train_linear_regression', methods=['GET'])
def train_linear_regression():
    global linear_regression_model, scaler

    # Load dataset
    df = pd.read_csv('dataset.csv')

    # Define input features and output column
    X = df.drop('output_column', axis=1)
    y = df['output_column']

    # Standardize the features
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Build and train the Linear Regression model
    linear_regression_model = LinearRegression()
    linear_regression_model.fit(X, y)

    # Save the trained model and scaler
    model_filename = 'linear_regression_model.pkl'
    joblib.dump(linear_regression_model, model_filename)

    scaler_filename = 'scaler.pkl'
    joblib.dump(scaler, scaler_filename)

    return jsonify({'message': 'Linear Regression model trained successfully'})

@app.route('/predict_linear_regression', methods=['POST'])
def predict_linear_regression():
    global linear_regression_model, scaler

    data = request.get_json()

    # Ensure that the input data has the correct format
    if 'features' not in data:
        return jsonify({'error': 'Missing features'}), 400

    features = data['features']

    # Standardize the input features
    standardized_features = scaler.transform([features])

    # Make a prediction using the trained model
    prediction = linear_regression_model.predict(standardized_features)[0]

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)

'''