from flask import Blueprint, jsonify, request, send_file
from app import app
from flask_login import current_user, login_required
from app.train.utils import add_to_train_db, train_model_api
from app.train.train_algo.KNN import train_knn_model 
from app.train.train_algo.SVM import train_svm_model 
from app.train.train_algo.DecisionTree import train_decision_tree_model 
from app.train.train_algo.RandomForest import train_random_forest_model 
from app.models import TrainingHistory

train = Blueprint('train', __name__)
'''
            API               | Complete |          NOTES
-------------------------------------------------------------------
Training:                     |          |
    user-trained-list         |   done   |      Check it in front
    KNN                       |   done   |      Check it in front
    SVM                       |   done   |      Check it in front
    DecisionTree              |   done   |      Check it in front
    RandomForest              |   done   |      Check it in front
'''
@train.route('/', methods=['GET'])
@login_required
def user_train_list():
    if (current_user and current_user.id):
        train_list = TrainingHistory.query.filter_by(user_id=current_user.id)
        train_list = [x.serialize() for x in train_list]
        return jsonify({'message': "successful", 'train_list':train_list}), 200
    return jsonify({'error': "error getting list"}), 400

@train.route('/<algorithm_name>', methods=['POST'])
@login_required
def train_the_data(algorithm_name):
    data = request.get_json()
    if (algorithm_name == "KNN"):
        return train_model_api(data, "K-Nearest Neighbors (KNN)", train_knn_model)
    if (algorithm_name == "SVM"):
        return train_model_api(data, "Support Vector Machine (SVM)", train_svm_model)
    if (algorithm_name == "DecisionTree"):
        return train_model_api(data,  "Decision Tree", train_decision_tree_model)
    if (algorithm_name == "RandomForest"):
        return train_model_api(data,  "Random Forest", train_random_forest_model)
    return jsonify({"error" : 'Algorithm not available!'}), 400

