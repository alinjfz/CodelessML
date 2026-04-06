from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Suggestion
from app.suggest.utils import suggest_algorithm

suggest = Blueprint('suggest',__name__)

'''
            API               | Complete |          NOTES
-------------------------------------------------------------------
suggest:                      |          |
    prediction                |    --    |      
    classification            |    --    |
'''

@suggest.route('/', methods=['GET'])
@login_required
def suggest_list():
    if current_user and current_user.id:
        suggest_list_current = Suggestion.query.filter_by(user_id=current_user.id)
        suggest_list_current = [x.serialize() for x in suggest_list_current]
        return jsonify({'message': 'Success', "suggests" : suggest_list_current }), 200
    else:
        return jsonify({'error': 'Please login first'}), 403
    

@suggest.route('/suggest_algorithm', methods=['POST'])
@login_required
def suggest_algorithm_endpoint():
    if (not current_user or not current_user.id):
        return jsonify({'error': 'Please login first'}), 403
    data = request.get_json()
    dataset_id = data.get('dataset_id')
    feature_columns = data.get('feature_columns')
    target_column = data.get('target_column')
    status, all_algorithms, suggested_algorithm = suggest_algorithm(current_user.id, dataset_id, feature_columns, target_column)
    if (not status):
        return suggest_algorithm, 400
    if suggested_algorithm:
        return jsonify({'suggested_algorithm': suggested_algorithm, "algo_list": all_algorithms}), 200
    else:
        return jsonify({'error': 'No suggestions available for the given dataset.'}), 400
