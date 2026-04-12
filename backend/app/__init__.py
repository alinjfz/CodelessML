from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from app.config import Config
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

migrate = Migrate(app, db)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s: %(message)s'
)
logging.getLogger('flask_cors').setLevel(logging.WARNING)
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

from app.auth.views import auth
app.register_blueprint(auth, url_prefix="/api/auth")

from app.train.views import train
app.register_blueprint(train, url_prefix="/api/train")

from app.algorithm.views import algorithm
app.register_blueprint(algorithm, url_prefix="/api/algorithm")

from app.suggest.views import suggest
app.register_blueprint(suggest, url_prefix="/api/suggest")

from app.uploader.views import uploader
app.register_blueprint(uploader, url_prefix="/api/uploader")

from app.predict.views import predict
app.register_blueprint(predict, url_prefix="/api/predict")

from app.downloader.views import downloader
app.register_blueprint(downloader, url_prefix="/download")

