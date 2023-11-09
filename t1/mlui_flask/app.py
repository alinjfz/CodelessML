from pickle import FALSE, TRUE
from flask import Flask, render_template
from flask_login import LoginManager
from config import Config
from flask import jsonify, request, url_for
from flask_login import login_user, current_user, logout_user, login_required
from models import AlgoList, User,db
from flask_mail import Mail, Message
import secrets  # for generating secure tokens
# from validate_email_address import validate_email
from flask_cors import CORS
'''
test                            done
privatetest                     done
register                        done
login                           done
logout                          done
reset_password                  do   
reset-password-confirm          do
change_password                 done
profile                         done
algo-list                       do

'''
login_manager = LoginManager()

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000/"}})
mail = Mail(app)
db.init_app(app)
login_manager.init_app(app)
site_url = Config.FRONT_URL

def add_default_values_to_model():
    # Check if the default values already exist in the database
    existing_default_values = AlgoList.query.filter_by(name='Backpropagation').first()
    if not existing_default_values:
        # Create a new instance of MyModel with default values
        default_model = AlgoList(
            name='Backpropagation',
            options='default',
            description='Backpropagation is short for backward propagation of errors.'
        )
        # Add the default model to the database
        db.session.add(default_model)
        db.session.commit()

with app.app_context():
    db.create_all()
    # add_default_values_to_model()

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).first()

@app.route('/', methods=['GET'])
def test_api():
    return jsonify({'message' : 'server is up!'})

@app.route('/api/privatetest', methods=['GET'])
@login_required
def privatetest_api():
    return jsonify({'message' : 'private server is up!'})

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()

    # Extract user data from the JSON request
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    # Check if the email is valid
    is_valid = TRUE #validate_email(email, verify=True)
    if (not is_valid):
        return jsonify({'error': 'Invalid email'}), 400
    
    # Check if the email is available
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 409

    # Create a new user
    new_user = User(email=email,name=name)
    new_user.set_password(password)

    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Registration successful', 'user':{'email': email, 'name': name}}), 201

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()

    # Extract user data from the JSON request
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'Login successful',"user":{ "email": email, "name" : user.name}}), 200
    else:
        return jsonify({'error': 'Login failed'}), 401

@app.route('/api/logout', methods=['GET'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

# Password reset request route
@app.route('/api/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    if 'email' in data:
        # Check if the email exists in the database
        user = User.query.filter_by(email=data['email']).first()
        if user:
            # Generate a secure token for resetting the password
            token = secrets.token_urlsafe(32)
            # Store the token in the user's record in the database
            user.reset_token = token
            db.session.commit()
            # Send an email with a link to reset the password
            reset_link = site_url + 'reset_password_confirm/' + token
            # reset_link = url_for(link_addup, token=token, _external=True)
            # reset_link = url_for("external_link", _external=True, _external_url=external_url)
            html_content = render_template('reset_password_email.html', user=user.name, reset_link=reset_link)  
            msg = Message(subject="Password Reset",sender='your_email@example.com', recipients=[user.email], html=html_content)
            mail.send(msg)
            return jsonify({'message': 'Password reset instructions sent via email'})
    return jsonify({'error': 'Invalid email'}), 400

# Password reset confirmation route
@app.route('/api/reset_password_confirm/<token>', methods=['POST'])
def reset_password_confirm(token):
    data = request.get_json()
    if 'password' in data:
        # Find the user with the provided token
        user = User.query.filter_by(reset_token=token).first()
        if user:
            # Update the user's password
            user.set_password(data['password'])
            # Clear the reset token
            user.reset_token = None
            db.session.commit()
            
            return jsonify({'message': 'Password has been successfully changed'})
    return jsonify({'error': 'Invalid request'}), 400

# Change password route
@app.route('/api/change_password', methods=['POST'])
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

@app.route('/api/profile', methods=['GET'])
@login_required
def profile():
    if current_user:
        email = current_user.email
        name = current_user.name
        return jsonify({'message': 'Success', 'user': { "email": email, "name" : name } }), 200
    else:
        return 'User not authenticated', 401
    
@app.route('/api/algo-list', methods=['GET'])
@login_required
def algo_list():
    if current_user:
        algo_list_current = AlgoList.query.all()
        return jsonify({'message': 'Success', "data":{"algo_list":algo_list_current}}), 200
    else:
        return jsonify({'error': 'Please login first'}), 403

'''
# # Define an endpoint that calls an external API with specific methods
# @app.route('/call_external_api', methods=['GET', 'POST'])
# def call_external_api():
#     external_api_url = 'https://api.example.com/data'  # Replace with the target API URL

#     if request.method == 'GET':
#         try:
#             # Make a GET request to the external API
#             response = requests.get(external_api_url)
#             data = response.json()
#             return jsonify(data)

#         except requests.exceptions.RequestException as e:
#             return jsonify({'error': 'Error connecting to the external API'})

#     elif request.method == 'POST':
#         # You can handle POST data here, if needed
#         post_data = request.get_json()

#         try:
#             # Make a POST request to the external API
#             response = requests.post(external_api_url, json=post_data)
#             data = response.json()
#             return jsonify(data)

#         except requests.exceptions.RequestException as e:
#             return jsonify({'error': 'Error connecting to the external API'})

#     else:
#         return jsonify({'error': 'Unsupported HTTP method'})
# from flask_restful_fileupload import FileUpload, FileContainer

# # Configuration for file upload
# app.config['UPLOAD_FOLDER'] = 'uploads'  # Change this to your desired upload folder
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB (adjust as needed)

# # Create a directory for file uploads if it doesn't exist
# import os
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# # Resource for file uploads
# class FileUploadResource(Resource):
#     def post(self):
#         parser = reqparse.RequestParser()
#         parser.add_argument('file', type=FileUpload)
#         args = parser.parse_args()
#         uploaded_file = args['file']

#         if not uploaded_file:
#             return {'message': 'File not provided'}, 400

#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_file.filename)
#         uploaded_file.save(file_path)

#         return {'message': 'File uploaded successfully', 'file_path': file_path}, 200

# # Add the file upload resource to your API
# api.add_resource(FileUploadResource, '/upload')
'''

if __name__ == '__main__':
    app.run(debug=True)