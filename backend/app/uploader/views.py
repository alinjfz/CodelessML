from flask import Blueprint, jsonify, request
from app import app
from flask_login import current_user, login_required
import os
from app.models import FileStorage
from app import app,db
from app.uploader.utils import analyze_csv


uploader = Blueprint('uploader',__name__)
'''
            API               | Complete |          NOTES
-------------------------------------------------------------------
uploading:                    |          |
    upload_dataset            |   done   |      Check it in front
    upload_list               |    --    |      Check it in front
'''

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['TRAIN_FOLDER'], exist_ok=True)

@uploader.route('/', methods=['GET'])
@login_required
def upload_list():
    if (current_user and current_user.id):
        upload_list = FileStorage.query.filter_by(user_id=current_user.id)
        upload_list = [x.serialize() for x in upload_list]
        return jsonify({'message': "successful", 'upload_list':upload_list}), 200
    return jsonify({'error': "error getting list"}), 400

@uploader.route('/upload', methods=['POST'])
@login_required
def upload_dataset():
    if (not current_user or not current_user.id):
        return jsonify({'User not authenticated'}), 401  
    if (not 'file' in request.files):
        return jsonify({'error': 'Missing required parameters'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = file.filename
    allowed_extensions = {'csv', 'jpg', 'png'}
    if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'File type not allowed'}), 400
    filetype = file.filename.rsplit('.', 1)[1].lower() # os.path.splitext(filename)[1].lstrip('.')
    
    size = len(file.read())
    file.seek(0)  # Reset file pointer to the beginning
    if (size > app.config['MAX_CONTENT_LENGTH']):
        return jsonify({'error': 'File is too large'}), 400

    new_file = FileStorage(user_id=current_user.id, filename=filename, filetype=filetype, size=size)
    db.session.add(new_file)
    db.session.commit()
    file_id = new_file.get_id()
    save_path = app.config['UPLOAD_FOLDER'] + current_user.id+ '/'
    os.makedirs(save_path, exist_ok=True)
    item = FileStorage.query.filter_by(id=file_id).first()
    if (item):
        file.save(item.get_file_dir_and_name())
        upload_list = FileStorage.query.filter_by(user_id=current_user.id)
        upload_list = [x.serialize() for x in upload_list]
        return jsonify({'message': "File uploaded successfully", 'upload_list':upload_list}), 200
        # item = item.serialize()
        # return jsonify({'message': 'File uploaded successfully', "dataset_id": file_id, "file": item }), 200
    return jsonify({'message': 'Error saving the file' }), 400
    
@uploader.route('/analysis', methods=['POST'])
@login_required
def analyze_dataset():
    if (not current_user or not current_user.id):
        return jsonify({'User not authenticated'}), 401 
    data = request.get_json()
    dataset_id = data.get('dataset_id')
    if (not dataset_id):
        return jsonify({'error' : 'Missing required parameters'}), 400
    uploaded_file = FileStorage.query.filter_by(id=dataset_id).first()
    if (not uploaded_file or uploaded_file.user_id != current_user.id):
        return jsonify({'error' : 'File not found'}), 404
    stat, result = analyze_csv(uploaded_file.get_file_dir_and_name())
    if (not stat):
        return jsonify({'error' : 'Analysis error'}), 400
    return result