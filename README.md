# CodelessML

**CodelessML** is a full-stack no-code machine learning platform. Upload a CSV dataset, pick your features, and train a production-ready ML classifier — no Python required.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.0+-orange.svg)
![pytest](https://img.shields.io/badge/tested%20with-pytest-yellowgreen.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

> Train a machine learning classifier on your own CSV — no Python required.

<!-- Add screenshot or GIF here -->

---

## What It Does

1. **Upload** your CSV dataset (up to 16 MB)
2. **Analyze** — get instant column types, missing values, correlations, and sample rows
3. **Get a recommendation** — the suggestion engine scores 4 algorithms against 7 dataset characteristics and returns a ranked recommendation
4. **Configure** — select features, target column, hyperparameters, and train/test split
5. **Train** — one click triggers scikit-learn training and computes accuracy, precision, recall, F1, and confusion matrix
6. **Evaluate** — view full metrics, confusion matrix visualization, and training history
7. **Predict** — load any saved model and run predictions on new data points in the browser
8. **Export** — download the trained `.joblib` model for use in your own Python code

---

## Research Background

CodelessML was built as original research:

> **Machine Learning Simplified: A Web Application Approach to Democratize Predictive Analytics, Empowering Non-Programmers through User-Friendly Interfaces**
> Ali Najafzadeh, October 2023

Inspired by: Nasoz & Shrestha, _"A Web-Based User Interface for Machine Learning Analysis"_, HIMI 2017, LNCS 10274.

The user interface applies Shneiderman's **Eight Golden Rules of Interface Design**: consistency across all training steps, informative feedback after every action, clear dialogs, error prevention through input validation, easy reversal of actions, support for different user skill levels, reduction of short-term memory load, and clear visual hierarchy.

---

## Key Technical Features

- **Supervised learning** — binary and multi-class classification on tabular CSV data
- **Four scikit-learn classifiers** with configurable hyperparameters:
  - K-Nearest Neighbors (k, distance metric)
  - Support Vector Machine (kernel: RBF, linear, poly)
  - Decision Tree (max depth, criterion)
  - Random Forest (n_estimators, max depth)
- **7-factor algorithm recommendation engine** — scores each algorithm against:
  - Dataset size (row count threshold)
  - Class imbalance (normalized value distribution)
  - Dimensionality (feature count)
  - Target column uniqueness (class cardinality)
  - Feature column uniqueness (proportion of unique values per column)
  - Linear correlation (Pearson correlation between features and target)
  - Non-linear correlation (Spearman correlation between features and target)
- **Model evaluation metrics** — accuracy, precision, recall, F1-score (weighted), confusion matrix
- **Data preprocessing analysis** — missing value detection, feature correlation matrix, class distribution, sample data preview
- **Personalized recommendations** using training history — surfaces highest-accuracy past model and closest feature-overlap past model for the same dataset
- **Secure multi-user system** — session-based auth, email verification, password reset via signed tokens
- **Model persistence** — serialize trained models to `.joblib` for downstream use; download via `/download/<train_id>`
- **Feature engineering support** — select any subset of columns as features; exclude irrelevant columns per training run

---

## Tech Stack

| Layer    | Technology                                                    |
| -------- | ------------------------------------------------------------- |
| Frontend | React 18, Redux Toolkit, redux-persist, React Bootstrap, SCSS |
| Backend  | Python 3.9+, Flask 2, Flask-Login, Flask-Mail                 |
| ML       | scikit-learn, pandas, numpy, joblib                           |
| Database | SQLite via SQLAlchemy ORM                                     |
| Testing  | pytest, Flask test client, in-memory SQLite                   |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend (React SPA)                    │
│   Dashboard · New Model Wizard · Train History · Predict     │
│   Redux state: auth + training data                          │
└───────────────────────┬──────────────────────────────────────┘
                        │  REST API (JSON)
┌───────────────────────▼──────────────────────────────────────┐
│                       Backend (Flask)                        │
│   /api/auth      → register, login, verify, password reset   │
│   /api/uploader  → CSV upload & analysis                     │
│   /api/suggest   → algorithm recommendation engine           │
│   /api/train     → model training (KNN / SVM / DT / RF)      │
│   /api/predict   → run predictions on trained models         │
│   /download      → model file export (.joblib)               │
└──────────┬───────────────────────────┬───────────────────────┘
           │                           │
┌──────────▼──────────┐   ┌────────────▼──────────────────────┐
│   SQLite Database   │   │    File System                    │
│   Users, Models,    │   │    uploads/        (CSV files)    │
│   Training History  │   │    trained_models/ (.joblib)      │
└─────────────────────┘   └───────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- pip

### 1. Clone the repo

```bash
git clone https://github.com/alinjfz/CodelessML.git
cd CodelessML
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in your values
python app.py                   # starts on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm start                       # starts on http://localhost:3000
```

---

## Environment Variables

| Variable              | Required | Default                  | Description                                                           |
| --------------------- | -------- | ------------------------ | --------------------------------------------------------------------- |
| `SECRET_KEY`          | Yes      | —                        | Flask session secret key (use a long random string)                   |
| `VERIFICATION_SALT`   | Yes      | —                        | Salt for email verification tokens                                    |
| `RESET_PASSWORD_SALT` | Yes      | —                        | Salt for password reset tokens                                        |
| `FRONTEND_URL`        | No       | `http://localhost:3000/` | Frontend base URL (used in email links)                               |
| `DATABASE_URL`        | No       | SQLite (auto)            | Override database URL (e.g. PostgreSQL)                               |
| `MAIL_ENABLED`        | No       | `False`                  | Set `True` to send real emails; `False` returns links in API response |
| `MAIL_SERVER`         | No       | `smtp.gmail.com`         | SMTP server hostname                                                  |
| `MAIL_PORT`           | No       | `587`                    | SMTP port                                                             |
| `MAIL_USERNAME`       | No       | —                        | Your email address                                                    |
| `MAIL_PASSWORD`       | No       | —                        | Your app password                                                     |
| `MAIL_USE_TLS`        | No       | `True`                   | Enable TLS                                                            |

---

## Supported Algorithms

| Algorithm                    | Key Hyperparameters                        | Best Use Case                                                       |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| K-Nearest Neighbors (KNN)    | `k_neighbors` (default: 5)                 | Small datasets, low dimensionality, simple decision boundaries      |
| Support Vector Machine (SVM) | `kernel` (rbf/linear/poly, default: rbf)   | Medium datasets, complex non-linear boundaries, high dimensionality |
| Decision Tree                | `max_depth` (default: None)                | Interpretable models, mixed feature types, categorical-heavy data   |
| Random Forest                | `n_estimators` (default: 100), `max_depth` | Large datasets, high dimensionality, class imbalance                |

Extra JSON fields beyond the standard training parameters (`dataset_id`, `target_column`, `feature_columns`, `test_size`, `random_state`) are automatically treated as hyperparameters.

---

## Sample Datasets

Two datasets are included under `sample_datasets/` for testing:

| File                     | Rows | Features | Task                                            |
| ------------------------ | ---- | -------- | ----------------------------------------------- |
| `breast-cancer-data.csv` | 569  | 30       | Binary classification (Benign / Malignant)      |
| `diabetes_data.csv`      | 768  | 8        | Binary classification (Diabetic / Non-diabetic) |

Both are standard ML benchmarks well-suited for demonstrating algorithm comparison and the suggestion engine. Upload either file in CodelessML, select your feature columns, click "Suggest Algorithm", then train.

---

## Running Tests

```bash
cd backend
source venv/bin/activate
python -m pytest app/tests/ -v
```

Test coverage:

| File                 | What it tests                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `test_auth.py`       | Register, login, logout, profile, password change — using Flask test client + in-memory SQLite                |
| `test_algorithms.py` | KNN, SVM, Decision Tree, Random Forest training on the real breast cancer CSV; `compute_metrics` output shape |
| `test_suggest.py`    | All 7 suggestion engine functions; regression test for the `unique_ratio` parameter shadowing bug fix         |

---

## API Reference

### Authentication — `/api/auth`

| Method | Path                      | Description                  | Auth |
| ------ | ------------------------- | ---------------------------- | ---- |
| POST   | `/register`               | Register new user            | No   |
| POST   | `/login`                  | Login                        | No   |
| GET    | `/logout`                 | Logout                       | Yes  |
| GET    | `/profile`                | Get current user profile     | Yes  |
| POST   | `/change_password`        | Change password              | Yes  |
| POST   | `/send_verification`      | Send email verification link | Yes  |
| POST   | `/verify_email`           | Verify email with token      | No   |
| POST   | `/reset_password`         | Send password reset email    | No   |
| POST   | `/reset_password_confirm` | Confirm reset with token     | No   |

### Upload — `/api/uploader`

| Method | Path        | Description            | Auth |
| ------ | ----------- | ---------------------- | ---- |
| GET    | `/`         | List uploaded datasets | Yes  |
| POST   | `/upload`   | Upload CSV (max 16 MB) | Yes  |
| POST   | `/analysis` | Analyze dataset        | Yes  |

### Training — `/api/train`

| Method | Path            | Description         | Auth |
| ------ | --------------- | ------------------- | ---- |
| GET    | `/`             | Training history    | Yes  |
| POST   | `/KNN`          | Train KNN           | Yes  |
| POST   | `/SVM`          | Train SVM           | Yes  |
| POST   | `/DecisionTree` | Train Decision Tree | Yes  |
| POST   | `/RandomForest` | Train Random Forest | Yes  |

### Suggestion — `/api/suggest`

| Method | Path                 | Description                  | Auth |
| ------ | -------------------- | ---------------------------- | ---- |
| GET    | `/`                  | Suggestion history           | Yes  |
| POST   | `/suggest_algorithm` | Get algorithm recommendation | Yes  |

### Prediction — `/api/predict`

| Method | Path | Description                     | Auth |
| ------ | ---- | ------------------------------- | ---- |
| POST   | `/`  | Run prediction with saved model | Yes  |

### Download — `/download`

| Method | Path          | Description                   | Auth |
| ------ | ------------- | ----------------------------- | ---- |
| GET    | `/<train_id>` | Download `.joblib` model file | Yes  |

---

## Project Structure

```
CodelessML/
├── backend/                      # Flask REST API
│   ├── app/
│   │   ├── __init__.py           # App factory, blueprint registration
│   │   ├── config.py             # Configuration (reads .env)
│   │   ├── models.py             # SQLAlchemy models (User, Algorithm, FileStorage, TrainingHistory, Suggestion)
│   │   ├── auth/views.py         # Auth routes
│   │   ├── uploader/             # CSV upload + analysis
│   │   ├── train/
│   │   │   ├── views.py          # Training routes
│   │   │   ├── utils.py          # Training orchestration, metrics, model save/load
│   │   │   └── train_algo/       # Algorithm implementations
│   │   │       ├── KNN.py
│   │   │       ├── SVM.py
│   │   │       ├── DecisionTree.py
│   │   │       └── RandomForest.py
│   │   ├── suggest/
│   │   │   ├── views.py          # Suggestion routes
│   │   │   └── utils.py          # 7-factor scoring + recommendation logic
│   │   ├── predict/views.py      # Prediction route
│   │   ├── algorithm/views.py    # Algorithm listing
│   │   ├── downloader/views.py   # Model download
│   │   └── tests/
│   │       ├── conftest.py       # pytest fixtures (app, client, registered_user)
│   │       ├── test_auth.py      # Auth API tests
│   │       ├── test_algorithms.py # ML algorithm unit tests
│   │       └── test_suggest.py   # Suggestion engine unit tests
│   ├── app.py                    # Entry point
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                     # React SPA
│   └── src/
│       ├── pages/                # Route-level components
│       ├── components/           # Reusable UI components
│       ├── api/                  # Fetch wrappers per domain
│       ├── reducers/             # Redux slices (auth, train)
│       └── constants/            # Page routes + API endpoints
│
├── sample_datasets/              # Benchmark CSVs for testing
├── LICENSE
└── README.md
```

---

## HCI Design Principles

The UI was designed following Shneiderman's **Eight Golden Rules of Interface Design** as documented in the accompanying research paper:

| Rule                                   | Application                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| Strive for consistency                 | Identical step layout and button placement across all training wizard steps        |
| Enable frequent users to use shortcuts | Direct algorithm selection bypasses the suggestion flow                            |
| Offer informative feedback             | Training progress, metrics, and error messages are shown inline after every action |
| Design dialogs to yield closure        | Each wizard step has a clear "Next" action; training ends with a results screen    |
| Prevent errors                         | Column selection UI prevents choosing the same column as both feature and target   |
| Permit easy reversal of actions        | Users can re-run training with different parameters without losing history         |
| Support internal locus of control      | Users explicitly control all parameters; suggestions are advisory, not mandatory   |
| Reduce short-term memory load          | Selected features are displayed throughout the wizard; no memorization required    |

---

## Development History

This project went through 6 iterations before reaching this final version. Each version is preserved as a git branch:

| Branch                                  | Date     | What it is                                                           |
| --------------------------------------- | -------- | -------------------------------------------------------------------- |
| `history/v1-visualml-nextui-experiment` | Oct 2023 | Frontend experiment with NextUI + Tailwind CSS                       |
| `history/v2-mlui-early-prototype`       | Nov 2023 | First ML platform attempt — auth scaffold + algorithm list           |
| `history/v3-ml-backend-scikit`          | Dec 2023 | First real ML — all 4 algorithms with scikit-learn                   |
| `history/v4-auth-system-fullstack`      | Jun 2024 | Production auth template (email verify, password reset, React+Redux) |
| `history/v5-csv-editor-prototype`       | Apr 2025 | CSV file editor, first exploration of pandas + Flask                 |
| `history/v6-integration-testing`        | Feb 2026 | Single-file integration test of the full auth+upload+train flow      |
| `main`                                  | Apr 2026 | This branch — final polished version                                 |

---

## License

MIT — see [LICENSE](LICENSE).
