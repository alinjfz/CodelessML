from datetime import datetime
from flask import Blueprint, abort, jsonify, send_file
from app import app
from flask_login import current_user, login_required
import os
from app.models import TrainingHistory
from app import app


downloader = Blueprint('download',__name__)

def is_valid_file(file_dir,file_path):
    return os.path.exists(file_dir) and os.path.isfile(file_path)

@downloader.route('/trained_models/<filedir>/<filename>',methods=["GET"])
@login_required
def download_file(filedir,filename):
    if (not current_user or not current_user.id):
        abort(401)
    if (filedir != current_user.id):
        abort(403)
    file_path = f'trained_models/{filedir}/{filename}'
    trained_model = TrainingHistory.query.filter_by(user_id=current_user.id,model_path=file_path).first()
    if (not trained_model):
        abort(401)
    # trained_models/a/b.joblib
    # Specify the file path based on the filename (adjust the path accordingly)
    # Send the file for download
    if (not os.path.exists(f'trained_models/{filedir}') or not os.path.isfile(file_path)):
        # Return a 404 Not Found response if the file is not available
        abort(401)
    # abort(403)
    download_name = "MLUI_Trained_Model_" + datetime.now().strftime('%Y%m%d-%H%M') + '.joblib'
    return send_file(os.path.abspath(file_path), as_attachment=True,download_name=download_name)
