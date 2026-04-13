# models.py
from flask import json
from flask_login import UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from app import db, login_manager, app
from datetime import datetime

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).first()
def load_user_by_email(email):
    return User.query.filter_by(email=email).first()
def get_uuid():
    return uuid4().hex

class User(db.Model,UserMixin):
    __tablename__ = "users"
    id = db.Column(db.String(128), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(345), nullable=False)
    email = db.Column(db.String(345), unique=True,nullable=False)
    password = db.Column(db.Text, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    verification_token = db.Column(db.String(100), nullable=True)

    uploaded_files = db.relationship('FileStorage', backref='user_upload', lazy=True)
    trained_history = db.relationship('TrainingHistory', backref='user_train', lazy=True)
    suggestion_history = db.relationship('Suggestion', backref='user_suggest', lazy=True)


    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.set_password(password)
    def get_id(self):
        return str(self.id)
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)

class Algorithm(db.Model,UserMixin):
    __tablename__ = "algorithms"
    id = db.Column(db.String(128), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), unique=True,nullable=False)
    description = db.Column(db.Text, nullable=True)
    short_description = db.Column(db.String(511), nullable=True)
    icon = db.Column(db.String(255), nullable=True)
    blog_url = db.Column(db.String(255), unique=True, nullable=False)

    trained_list = db.relationship('TrainingHistory', backref='trained_algo', lazy=True)
    suggested_list = db.relationship('Suggestion', backref='suggested_algo', lazy=True)
    def serialize(self):
        return {
                "id": self.id,
                "name": self.name,
                "description": self.description,
                "short_description": self.short_description,
                "icon": self.icon,
                "blog_url": self.blog_url,
               } 
    def __init__(self, name, blog_url, description=None,short_description=None,icon=None):
        self.name = name
        self.blog_url = blog_url
        self.description = description
        self.short_description = short_description
        self.icon = icon        
    def get_id(self):
        return str(self.id)

class FileStorage(db.Model,UserMixin):
    __tablename__ = "datasets"
    id = db.Column(db.String(128), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(128), db.ForeignKey('users.id'), unique=False, nullable=False)
    filename = db.Column(db.String, nullable=False)
    filetype = db.Column(db.String, nullable=False)
    size = db.Column(db.Integer, nullable=False)
    upload_date = db.Column(db.DateTime, nullable=False,default=datetime.utcnow)

    trained_list = db.relationship('TrainingHistory', backref='trained_file', lazy=True)
    suggested_list = db.relationship('Suggestion', backref='suggested_file', lazy=True)

    def serialize(self):
        return { 
                "id": self.id,
                "filename": self.filename,
                "filetype": self.filetype,
                "size": self.size,
                "upload_date": self.upload_date,
               }
    def __init__(self, user_id, filename, filetype, size):
        self.user_id = user_id
        self.filename = filename
        self.filetype = filetype
        self.size = size
    def get_id(self):
        return str(self.id)
    
    def get_file_dir(self):
        return app.config['UPLOAD_FOLDER'] + current_user.id + '/'
    def get_filename(self):
        return self.id + '_' + self.filename
    def get_file_dir_and_name(self):
        return self.get_file_dir() + self.get_filename()

class TrainingHistory(db.Model,UserMixin):
    __tablename__ = "trains"
    id = db.Column(db.String(128), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(128), db.ForeignKey('users.id'),unique=False, nullable=False, index=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'), unique=False, nullable=False)
    algo_id = db.Column(db.Integer, db.ForeignKey('algorithms.id'), unique=False, nullable=False)
    training_date = db.Column(db.DateTime, nullable=False,default=datetime.utcnow)
    feature_columns = db.Column(db.String, nullable=True)
    target_column = db.Column(db.String, nullable=False)
    accuracy = db.Column(db.Float, nullable=True)
    model_path = db.Column(db.String, nullable=True)
    hyper_parameters = db.Column(db.JSON, nullable=True)
    cost = db.Column(db.Float, nullable=True)
    metrics = db.Column(db.JSON, nullable=True)

    def set_feature_columns(self, array_data):
        self.feature_columns = json.dumps(array_data)
    def get_feature_columns(self):
        return json.loads(self.feature_columns) if self.feature_columns else None
    
    def get_file_dir(self):
        return app.config['TRAIN_FOLDER'] + self.user_id + '/'    
    def model_filename(self):
        return self.id + '.joblib'
    def update_model_path(self):
        self.model_path = self.get_file_dir() + self.model_filename()

    def serialize(self):
        return { 
                "id": self.id,
                "dataset_id": self.dataset_id,
                "algo_id": self.algo_id,
                "training_date": self.training_date,
                "feature_columns": self.feature_columns,
                "target_column": self.target_column,
                "accuracy": self.accuracy,
                "model_path": self.model_path,
                "hyper_parameters": self.hyper_parameters,
                "cost": self.cost,
                "metrics": self.metrics,
            }
    def __init__(self, user_id, dataset_id, algo_id, target_column, feature_columns=None, accuracy=None, model_path=None, hyper_parameters=None, cost=None, metrics=None):
        self.user_id = user_id
        self.dataset_id = dataset_id
        self.algo_id = algo_id
        self.feature_columns = feature_columns
        self.target_column = target_column
        self.accuracy = accuracy
        self.model_path = model_path
        self.hyper_parameters = hyper_parameters
        self.cost = cost
        self.metrics = metrics
    def get_id(self):
        return str(self.id)

class Suggestion(db.Model,UserMixin):
    __tablename__ = 'suggestions'
    id = db.Column(db.String(128), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(128), db.ForeignKey('users.id'), unique=False, nullable=False)
    dataset_id = db.Column(db.String(128), db.ForeignKey('datasets.id'), unique=False, nullable=False)
    suggested_algo_id = db.Column(db.String(128), db.ForeignKey('algorithms.id'), unique=False, nullable=False)
    feature_columns = db.Column(db.String, nullable=True)
    target_column = db.Column(db.String, nullable=False)
    hyper_parameters = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    def set_feature_columns(self, array_data):
        self.feature_columns = json.dumps(array_data)
    def get_feature_columns(self):
        return json.loads(self.feature_columns) if self.feature_columns else None    
    def serialize(self):
        return { 
                "id": self.id,
                "dataset_id": self.dataset_id,
                "suggested_algo_id": self.suggested_algo_id,
                "feature_columns": self.feature_columns,
                "target_column": self.target_column,
                "hyper_parameters": self.hyper_parameters,
                "created_at": self.created_at,
            }
    def __init__(self, user_id, dataset_id, suggested_algo_id, feature_columns, target_column, hyper_parameters=None):
        self.user_id = user_id
        self.dataset_id = dataset_id
        self.suggested_algo_id = suggested_algo_id
        self.set_feature_columns(feature_columns)
        self.target_column = target_column
        self.hyper_parameters = hyper_parameters

