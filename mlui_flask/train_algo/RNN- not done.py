'''
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense
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

# Reshape data for RNN input
X_train_rnn = X_train.reshape((X_train.shape[0], 1, X_train.shape[1]))
X_test_rnn = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))

# Build and train the Recurrent Neural Network (RNN) model
rnn_model = Sequential()
rnn_model.add(SimpleRNN(units=50, activation='relu', input_shape=(1, X_train.shape[1])))
rnn_model.add(Dense(units=1))

rnn_model.compile(optimizer='adam', loss='mean_squared_error')
rnn_model.fit(X_train_rnn, y_train, epochs=50, batch_size=32)

# Save the trained model and scaler
model_filename = 'rnn_model.h5'
rnn_model.save(model_filename)

scaler_filename = 'scaler.pkl'
joblib.dump(scaler, scaler_filename)










from flask import Flask, jsonify, request
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Initialize variables for the model and scaler
rnn_model = None
scaler = None

@app.route('/train_rnn', methods=['GET'])
def train_rnn():
    global rnn_model, scaler

    # Load dataset
    df = pd.read_csv('dataset.csv')

    # Define input features and output column
    X = df.drop('output_column', axis=1)
    y = df['output_column']

    # Standardize the features
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Reshape data for RNN input
    X_rnn = X.reshape((X.shape[0], 1, X.shape[1]))

    # Build and train the Recurrent Neural Network (RNN) model
    rnn_model = Sequential()
    rnn_model.add(SimpleRNN(units=50, activation='relu', input_shape=(1, X.shape[1])))
    rnn_model.add(Dense(units=1))

    rnn_model.compile(optimizer='adam', loss='mean_squared_error')
    rnn_model.fit(X_rnn, y, epochs=50, batch_size=32)

    # Save the trained model and scaler
    model_filename = 'rnn_model.h5'
    rnn_model.save(model_filename)

    scaler_filename = 'scaler.pkl'
    joblib.dump(scaler, scaler_filename)

    return jsonify({'message': 'RNN model trained successfully'})

@app.route('/predict_rnn', methods=['POST'])
def predict_rnn():
    global rnn_model, scaler

    data = request.get_json()

    # Ensure that the input data has the correct format
    if 'features' not in data:
        return jsonify({'error': 'Missing features'}), 400

    features = data['features']
    features = np.array(features).reshape((1, 1, len(features)))

    # Standardize the input features
    standardized_features = scaler.transform(features)

    # Make a prediction using the trained model
    prediction = rnn_model.predict(standardized_features)[0][0]

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)



'''