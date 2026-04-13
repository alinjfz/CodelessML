import pytest


def test_register_success(client):
    res = client.post('/api/auth/register', json={
        'email': 'new@example.com', 'name': 'Ali', 'password': 'Pass123!'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['user']['email'] == 'new@example.com'


def test_register_duplicate_email(client):
    payload = {'email': 'dup@example.com', 'name': 'Ali', 'password': 'Pass123!'}
    client.post('/api/auth/register', json=payload)
    res = client.post('/api/auth/register', json=payload)
    assert res.status_code == 409


def test_register_invalid_email(client):
    res = client.post('/api/auth/register', json={
        'email': 'notanemail', 'name': 'Ali', 'password': 'Pass123!'
    })
    assert res.status_code == 400


def test_login_success(client, registered_user):
    res = client.post('/api/auth/login', json=registered_user)
    assert res.status_code == 200
    assert res.get_json()['user']['email'] == registered_user['email']


def test_login_wrong_password(client, registered_user):
    res = client.post('/api/auth/login', json={
        'email': registered_user['email'], 'password': 'wrongpassword'
    })
    assert res.status_code == 401


def test_logout_requires_login(client):
    res = client.get('/api/auth/logout')
    assert res.status_code == 401


def test_get_profile_authenticated(logged_in_client):
    res = logged_in_client.get('/api/auth/profile')
    assert res.status_code == 200
    assert 'email' in res.get_json()['user']


def test_change_password(logged_in_client):
    res = logged_in_client.post('/api/auth/change_password', json={
        'current_password': 'StrongPass123!',
        'new_password': 'NewPass456!'
    })
    assert res.status_code == 200
