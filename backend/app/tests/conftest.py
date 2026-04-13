import pytest
import os
from app import app as flask_app, db

SAMPLE_CSV = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'sample_datasets', 'breast-cancer-data.csv')

@pytest.fixture()
def app():
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "WTF_CSRF_ENABLED": False,
        "MAIL_ENABLED": False,
    })
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def sample_csv_path():
    return SAMPLE_CSV

@pytest.fixture()
def registered_user(client):
    client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'name': 'Test User',
        'password': 'StrongPass123!'
    })
    return {'email': 'test@example.com', 'password': 'StrongPass123!'}

@pytest.fixture()
def logged_in_client(client, registered_user):
    client.post('/api/auth/login', json=registered_user)
    return client
