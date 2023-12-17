
from pickle import FALSE, TRUE
from flask import Flask, render_template
from flask_login import LoginManager
from config import Config
from flask import jsonify, request, url_for
from flask_login import login_user, current_user, logout_user, login_required
from models import Algorithm, User, db
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
import secrets  # for generating secure tokens
from validate_email_address import validate_email


from models import Algorithm
from models import db

def add_default_values_to_model():
    # Check if the default values already exist in the database
    existing_default_values = Algorithm.query.filter_by(name='Backpropagation').first()
    if not existing_default_values:
        # Create a new instance of MyModel with default values
        default_model = Algorithm(
            name='Backpropagation',
            options='default',
            description='Backpropagation is short for backward propagation of errors.'
        )
        # Add the default model to the database
        db.session.add(default_model)
        db.session.commit()


add_default_values_to_model()

