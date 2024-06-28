from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from auth_temp_flask.config import Config
from flask_cors import CORS
from flask_mail import Mail
import logging

app = Flask(__name__)
app.config.from_object(Config)
# CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app,support_credentials=True)

db = SQLAlchemy()
db.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app,db)
logging.getLogger('flask_cors').level = logging.DEBUG
#########################
##### CONFIG MAIL #######
#########################
mail = Mail(app)

#########################
#### LOGIN CONFIGS ######
#########################

login_manager = LoginManager()
# We can now pass in our app to the login manager
login_manager.init_app(app)


site_url = Config.FRONT_URL
#########################
####     TOKEN     ######
#########################
from itsdangerous import URLSafeTimedSerializer
def generate_token(email, salt):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config[salt])
def verify_token(token, salt):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt=app.config[salt], max_age=3600)
        return email
    except Exception as e:
        # Token is invalid or expired
        return None

############################
#### BLUEPRINT CONFIGS #####
############################

from auth_temp_flask.auth.views import auth
app.register_blueprint(auth, url_prefix="/api/auth")

from auth_temp_flask.test_api.views import test
app.register_blueprint(test, url_prefix="/api/test")
