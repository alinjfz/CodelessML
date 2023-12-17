# models.py
from email.policy import default
from enum import unique
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model,UserMixin):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(345), unique=False, nullable=False)
    email = db.Column(db.String(345), unique=True,nullable=False)
    password = db.Column(db.Text, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    verification_token = db.Column(db.String(100), nullable=True)
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
    
class Algorithm(db.Model):
    __tablename__ = "algorithm"
    id = db.Column(db.Integer, primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    options = db.Column(db.String(345), nullable=True)
    description = db.Column(db.Text, nullable=True)

    def __init__(self, name, options, description):
        self.name = name
        self.options = options
        self.description = description
    
    def get_id(self):
        return str(self.id)
    
'''
from datetime import datetime
class DatasetStorage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    def __init__(self, user_id, filename, size):
        self.user_id = user_id
        self.filename = filename
        self.size = size
'''