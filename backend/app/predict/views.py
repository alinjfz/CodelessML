from flask import Blueprint, jsonify, request
from app import app
from flask_login import current_user, login_required
from app.train.utils import load_model, predict_with_model

predict = Blueprint('predict', __name__)
'''
            API               | Complete |          NOTES
-------------------------------------------------------------------
Prediction:                   |          |
    predict_data_endpoint     |    --    |      Check it in front
'''
@predict.route('/', methods=['POST'])
@login_required
def predict_data_endpoint():
    data = request.get_json()
    if (not current_user or not current_user.id):
        return jsonify({'error': 'Please login first'}), 401
    train_id = data.get('train_id')
    user_data = data.get('user_data')
    if (not train_id or not user_data):
        return jsonify({'error': 'Missing required parameters'}), 403
    load_stat, model, train_data = load_model(train_id, current_user.id)
    if (not load_stat):
        return model, 400
    predict_stat, prediction = predict_with_model(model, train_data, user_data)

    if (not predict_stat):
        return jsonify({'error': 'Unable to predict'}), 400      
    return jsonify({'message': 'Prediction successful', "prediction":prediction}), 200