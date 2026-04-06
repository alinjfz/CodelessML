# ModelForge — Backend

Flask REST API powering the ModelForge ML training platform.

---

## Setup

### Requirements
- Python 3.9+
- pip

### Install

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Configure

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Flask secret key (use a long random string) |
| `DATABASE_URL` | SQLite path, e.g. `sqlite:///modelforge.db` |
| `VERIFICATION_SALT` | Salt for email verification tokens |
| `RESET_PASSWORD_SALT` | Salt for password reset tokens |
| `MAIL_SERVER` | SMTP server hostname |
| `MAIL_PORT` | SMTP port (e.g. 587) |
| `MAIL_USERNAME` | Your email address |
| `MAIL_PASSWORD` | Your email password |
| `FRONTEND_URL` | Frontend base URL (default: `http://localhost:3000/`) |

### Run

```bash
python app.py
```

API will be available at `http://localhost:5000`.

---

## API Endpoints

### Authentication — `/api/auth`

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login | No |
| GET | `/logout` | Logout | Yes |
| GET | `/profile` | Get current user profile | Yes |
| POST | `/change_password` | Change password | Yes |
| POST | `/send_verification` | Send email verification link | Yes |
| POST | `/verify_email` | Verify email with token | No |
| POST | `/reset_password` | Send password reset email | No |
| POST | `/reset_password_confirm` | Confirm reset with token | No |

### Upload — `/api/uploader`

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| GET | `/` | List user's uploaded datasets | Yes |
| POST | `/upload` | Upload a CSV file (max 16 MB) | Yes |
| POST | `/analysis` | Analyze a dataset (columns, types, correlations, samples) | Yes |

### Training — `/api/train`

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| GET | `/` | Get training history | Yes |
| POST | `/KNN` | Train K-Nearest Neighbors model | Yes |
| POST | `/SVM` | Train Support Vector Machine model | Yes |
| POST | `/DecisionTree` | Train Decision Tree model | Yes |
| POST | `/RandomForest` | Train Random Forest model | Yes |

Training request body (all algorithms):
```json
{
  "dataset_id": "<uuid>",
  "target_column": "species",
  "feature_columns": ["sepal_length", "sepal_width"],
  "test_size": 0.2,
  "random_state": 42,
  "k_neighbors": 5
}
```
Extra fields beyond the standard ones are treated as hyperparameters.

### Suggestion — `/api/suggest`

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| GET | `/` | Get suggestion history | Yes |
| POST | `/suggest_algorithm` | Recommend algorithms for a dataset | Yes |

Request body:
```json
{
  "dataset_id": "<uuid>",
  "target_column": "species",
  "feature_columns": ["sepal_length", "sepal_width"]
}
```

Returns: scores per algorithm + reasons + suggestions from past training history.

### Prediction — `/api/predict`

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| POST | `/` | Run prediction with a trained model | Yes |

Request body:
```json
{
  "train_id": "<uuid>",
  "user_data": {
    "sepal_length": 5.1,
    "sepal_width": 3.5
  }
}
```

### Algorithms — `/api/algorithm`

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| GET | `/` | List all available algorithms | No |

### Download — `/download`

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| GET | `/<train_id>` | Download trained model as `.joblib` | Yes |

---

## Database Models

| Model | Table | Description |
|-------|-------|-------------|
| `User` | `users` | User accounts with hashed passwords |
| `Algorithm` | `algorithms` | Available ML algorithms (seeded at startup) |
| `FileStorage` | `datasets` | Metadata for uploaded CSV files |
| `TrainingHistory` | `trains` | Trained model records with accuracy, hyperparams, file path |
| `Suggestion` | `suggestions` | Algorithm suggestion history per user/dataset |

Files are stored on disk:
- Uploaded CSVs: `uploads/<user_id>/<dataset_id>_<filename>`
- Trained models: `trained_models/<user_id>/<train_id>.joblib`

---

## Adding a New Algorithm

1. Create `app/train/train_algo/MyAlgo.py` with a `train_myalgo_model(file_name, target_column, feature_columns, test_size, random_state, hyper_parameters)` function that returns `(bool, result_dict, model, features)`.

2. Register a new route in `app/train/views.py`:
   ```python
   @train.route('/MyAlgo', methods=['POST'])
   @login_required
   def train_myalgo():
       data = request.get_json()
       return train_model_api(data, 'My Algorithm Name', train_myalgo_model)
   ```

3. Seed the algorithm name into the `algorithms` table (or add it via a migration).

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # App factory, blueprint registration
│   ├── config.py            # Configuration (reads from .env)
│   ├── models.py            # SQLAlchemy models
│   ├── auth/
│   │   └── views.py         # Auth routes
│   ├── uploader/
│   │   ├── views.py         # Upload routes
│   │   └── utils.py         # CSV analysis helpers
│   ├── train/
│   │   ├── views.py         # Training routes
│   │   ├── utils.py         # Training orchestration, model save/load
│   │   └── train_algo/      # Algorithm implementations
│   │       ├── KNN.py
│   │       ├── SVM.py
│   │       ├── DecisionTree.py
│   │       └── RandomForest.py
│   ├── suggest/
│   │   ├── views.py         # Suggestion routes
│   │   └── utils.py         # Scoring + recommendation logic
│   ├── predict/
│   │   └── views.py         # Prediction route
│   ├── algorithm/
│   │   └── views.py         # Algorithm listing
│   ├── downloader/
│   │   └── views.py         # Model download
│   └── templates/
│       ├── verify_email.html
│       └── reset_password_email.html
├── app.py                   # Entry point
├── requirements.txt
└── .env.example
```
