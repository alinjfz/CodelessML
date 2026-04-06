from flask import Flask, render_template,Blueprint
from flask import jsonify, request, url_for
from flask_login import login_user, current_user, logout_user, login_required
from app.models import User, db, load_user_by_email
from app import mail, site_url, generate_token, verify_token
from flask_mail import Message
import re


'''
            API               | Complete |          NOTES
-------------------------------------------------------------------
Auth:                         |          |
    register                  |   done   |      send email verification 
    login                     |   done   |
    logout                    |   done   |
    reset_password            |   done   |      
    reset-password-confirm    |   done   |      
    change_password           |   done   |
    profile                   |   done   |
    send email verification   |   done   |      
    verify email              |   done   |      
'''

auth = Blueprint('auth',__name__)

@auth.route('/register', methods=['POST'])
def api_register():
    data = request.get_json()
    if 'email' in data and 'name' in data and 'password' in data:
        # Extract user data from the JSON request
        email = data.get('email')
        name = data.get('name')
        password = data.get('password')
        # Check if the email is valid
        is_valid = bool(re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email))
        if (not is_valid):
            return jsonify({'error': 'Invalid email'}), 400
        
        # Check if the email is available
        if load_user_by_email(email):
            return jsonify({'error': 'User already exists'}), 409

        # Create a new user
        new_user = User(email=email,name=name, password=password)

        # Add the user to the database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Registration successful', 'user':{'email': email, 'name': name}}), 201
    return jsonify({'error': 'Registration failed'}), 400
@auth.route('/login', methods=['POST'])
def api_login():
    data = request.get_json()

    # Extract user data from the JSON request
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = load_user_by_email(email)
    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'Login successful',"user":{ "email": email, "name" : user.name, "is_verified":user.is_verified}}), 200
    else:
        return jsonify({'error': 'Login failed'}), 401
@auth.route('/logout', methods=['GET'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200
@auth.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    if 'email' in data:
        # Check if the email exists in the database
        email = data['email']
        user = load_user_by_email(email)
        if user:
            # Generate a secure token for resetting the password
            token = generate_token(email, 'RESET_PASSWORD_SALT') #token = secrets.token_urlsafe(32)
            # Store the token in the user's record in the database
            user.reset_token = token
            db.session.commit()
            # Send an email with a link to reset the password
            reset_link = site_url + 'reset_password_confirm/' + token
            # reset_link = url_for(link_addup, token=token, _external=True)
            # reset_link = url_for("external_link", _external=True, _external_url=external_url)
            html_content = render_template('reset_password_email.html', user=user.name, reset_link=reset_link)  
            msg = Message(subject="Password Reset",sender='my_email@example.com', recipients=[user.email], html=html_content)
            mail.send(msg)
            return jsonify({'message': 'Password reset instructions sent via email'})
    return jsonify({'error': 'Invalid email'}), 400
@auth.route('/reset_password_confirm', methods=['POST'])
def reset_password_confirm():
    data = request.get_json()
    if 'password' in data and 'token' in data:
        token = data['token']
        email = verify_token(token, 'RESET_PASSWORD_SALT')
        user = User.query.filter_by(reset_token=token).first()
        if not email or not user:
            return jsonify({'error': 'token has expired'}), 400
        if user and user.email == email:
            # Update the user's password
            user.set_password(data['password'])
            # Clear the reset token
            user.reset_token = None
            db.session.commit()
            return jsonify({'message': 'Password has been successfully changed'}), 200
    return jsonify({'error': 'Invalid request'}), 400
@auth.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    if 'current_password' in data and 'new_password' in data:
        if current_user:
            # Verify the current password
            if current_user.check_password(data['current_password']):
                # Update the user's password
                current_user.set_password(data['new_password'])
                db.session.commit()
                return jsonify({'message': 'Password changed successfully'})
            else:
                return jsonify({'error': 'Current password is incorrect'}), 400
    return jsonify({'error': 'Invalid request'}), 400
@auth.route('/profile', methods=['GET'])
@login_required
def profile():
    if current_user:
        email = current_user.email
        name = current_user.name
        is_verified = current_user.is_verified
        return jsonify({'message': 'Success', 'user': { "email": email, "name" : name,"is_verified": is_verified } }), 200
    else:
        return 'User not authenticated', 401  
@auth.route('/send_verification', methods=['POST'])
@login_required
def send_verification():
    if current_user:
        if current_user.is_verified:
            return jsonify({'message': 'The user is already verified'}), 200
        email = current_user.email
        name = current_user.name
        token = generate_token(email, 'VERIFICATION_SALT')
        current_user.verification_token = token
        db.session.commit()
        verification_link = site_url + 'verify_email/' + token
        html_content = render_template('verify_email.html', user=name, verification_link=verification_link)  
        msg = Message(subject="Email Verification",sender='my_email@example.com', recipients=[email], html=html_content)
        mail.send(msg)
        return jsonify({'message': 'Email verification instructions sent via email'}), 200
    return jsonify({'error': 'cannot complete your request'}), 500
@auth.route('/verify_email', methods=['POST'])
def verify_email():
    data = request.get_json()
    if 'token' in data:
        token = data['token']
        email = verify_token(token, 'VERIFICATION_SALT')
        user = User.query.filter_by(verification_token=token).first()
        if not email or not user:
            return jsonify({'error': 'token has expired'}), 400
        if user and user.email == email:
            # verify email
            user.is_verified = True
            # Clear the reset token
            user.verification_token = None
            db.session.commit()
            return jsonify({'message': 'Email has been successfully verified'})
    return jsonify({'error': 'Invalid request'}), 400
