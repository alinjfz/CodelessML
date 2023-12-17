import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    VERIFICATION_SALT = os.environ.get('VERIFICATION_SALT')
    RESET_PASSWORD_SALT = os.environ.get('RESET_PASSWORD_SALT')
    TOKEN_EXPIRATION = 3600 # Set the expiration time in seconds (1 hour)
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///mlsud.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SECURE = True
    # SESSION_COOKIE_HTTPONLY = False
    # STATIC_URL_PATH='http://localhost:3000/'
    FRONT_URL = 'http://localhost:3000/'
    MAIL_DEFAULT_SENDER = [None]
    MAIL_SERVER = '127.0.0.1'
    MAIL_PORT = 1025
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    # Upload
    UPLOAD_FOLDER = 'uploads/'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB