from flask import Blueprint, jsonify
from flask_login import current_user, login_required

from app.models import Algorithm

algorithm = Blueprint('algorithm',__name__)
'''
            API               | Complete |          NOTES
-------------------------------------------------------------------
Algorithms:                   |          |
    list                      |   done   |      Check it in front
                              |          |
'''

@algorithm.route('/list', methods=['GET'])
@login_required
def algo_list():
    if current_user:
        algo_list_current = Algorithm.query.all()
        algo_list_current = [x.serialize() for x in algo_list_current]
        return jsonify({'message':"the list already exists", 'algo_list' : algo_list_current}), 200    
    else:
        return jsonify({'error': 'Please login first'}), 403