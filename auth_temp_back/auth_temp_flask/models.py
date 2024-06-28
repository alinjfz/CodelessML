# models.py
from email.policy import default
from enum import unique
from flask import json
from flask_login import UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from auth_temp_flask import db, login_manager, app
from datetime import datetime

@login_manager.user_loader
def load_user(user_id):
    # return User.query.get(user_id)
    return User.query.filter_by(id=user_id).first()

def load_user_by_email(email):
    return User.query.filter_by(email=email).first()

def get_uuid():
    return uuid4().hex
# Done
class User(db.Model,UserMixin):
    __tablename__ = "users"
    id = db.Column(db.String(128), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(345), nullable=False)
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

class Test_table(db.Model, UserMixin):
    id = db.Column(db.String(128), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String, nullable=True)
    def __init__(self, name):
        self.name = name
    