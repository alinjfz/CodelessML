from functools import wraps
from flask import session, redirect, url_for
from flask import Flask, render_template, request, jsonify
import pandas as pd
from pathlib import Path

app = Flask(__name__)

# Default CSV file path
CSV_FILE = 'data.csv'

# Create empty CSV if it doesn't exist
if not Path(CSV_FILE).exists():
    pd.DataFrame(columns=['Column1', 'Column2']).to_csv(CSV_FILE, index=False)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/download_csv')
def download_csv():
    try:
        from flask import send_file
        return send_file(
            CSV_FILE,
            mimetype='text/csv',
            as_attachment=True,
            download_name='data.csv'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Authentication configuration
USERNAME = 'admin'
PASSWORD = 'password123'  # In production, use hashed passwords and env variables


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == USERNAME and request.form['password'] == PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))
        return render_template('login.html', error='Invalid credentials')
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))


# Set a secret key for sessions
app.secret_key = 'your-secret-key-here'  # In production, use env variable

# Add login_required decorator to protected routes


@app.route('/')
@login_required
def index():
    return render_template('index.html')


@app.route('/download_csv')
@login_required
def download_csv():
    try:
        from flask import send_file
        return send_file(
            CSV_FILE,
            mimetype='text/csv',
            as_attachment=True,
            download_name='data.csv'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get_data')
def get_data():
    try:
        df = pd.read_csv(CSV_FILE)
        return jsonify({
            'columns': df.columns.tolist(),
            'data': df.values.tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/update_data', methods=['POST'])
def update_data():
    try:
        data = request.json
        df = pd.DataFrame(data['data'], columns=data['columns'])
        df.to_csv(CSV_FILE, index=False)
        return jsonify({'message': 'Data updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
