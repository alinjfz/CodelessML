# ModelForge

**ModelForge** is a full-stack no-code machine learning platform. Upload a CSV dataset, pick your features, and train a production-ready ML model — no Python required.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.0+-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Features

- **Dataset Upload & Analysis** — Upload CSV files and get instant stats: column types, correlations, missing values, and sample data
- **Smart Algorithm Suggestions** — A recommendation engine analyzes your dataset (size, dimensionality, class balance, feature correlations) and suggests the best algorithm
- **One-Click Model Training** — Train KNN, SVM, Decision Tree, or Random Forest with configurable hyperparameters and train/test split
- **Prediction Interface** — Load any trained model and make predictions on new data points in the browser
- **Model Download** — Export your trained `.joblib` model for use in your own code
- **Training History** — Full history of every model you've trained with accuracy scores and configurations
- **User Accounts** — Register, login, email verification, and password reset — all data is user-isolated

---

## Research Background

ModelForge was built as a research project. It is based on the paper:

> **Machine Learning Simplified: A Web Application Approach to Democratize Predictive Analytics, Empowering Non-Programmers through User-Friendly Interfaces**
> Ali Najafzadeh, October 2023

Inspired by: Nasoz & Shrestha, *"A Web-Based User Interface for Machine Learning Analysis"*, HIMI 2017, LNCS 10274.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Bootstrap, SCSS |
| Backend | Python 3.9+, Flask 2, Flask-Login, Flask-Mail |
| ML | scikit-learn, pandas, numpy, joblib |
| Database | SQLite via SQLAlchemy ORM |

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
│   /api/auth      → register, login, verify, password reset  │
│   /api/uploader  → CSV upload & analysis                     │
│   /api/suggest   → algorithm recommendation engine          │
│   /api/train     → model training (KNN / SVM / DT / RF)     │
│   /api/predict   → run predictions on trained models        │
│   /download      → model file export (.joblib)              │
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

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/modelforge.git
cd modelforge
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

## Development History

This project went through 6 iterations before reaching this final version. Each version is preserved as a git branch:

| Branch | Date | What it is |
|--------|------|-----------|
| `history/v1-visualml-nextui-experiment` | Oct 2023 | Frontend experiment with NextUI + Tailwind CSS |
| `history/v2-mlui-early-prototype` | Nov 2023 | First ML platform attempt — auth scaffold + algorithm list |
| `history/v3-ml-backend-scikit` | Dec 2023 | First real ML — all 4 algorithms with scikit-learn |
| `history/v4-auth-system-fullstack` | Jun 2024 | Production auth template (email verify, password reset, React+Redux) |
| `history/v5-csv-editor-prototype` | Apr 2025 | CSV file editor, first exploration of pandas + Flask |
| `history/v6-integration-testing` | Feb 2026 | Single-file integration test of the full auth+upload+train flow |
| `main` | Apr 2026 | This branch — final polished version |

---

## Project Structure

```
modelforge/
├── backend/                  # Flask REST API
│   ├── app/                  # Main application package
│   │   ├── auth/             # Authentication
│   │   ├── uploader/         # CSV upload and analysis
│   │   ├── train/            # Model training + algorithm implementations
│   │   │   └── train_algo/   # KNN, SVM, DecisionTree, RandomForest
│   │   ├── suggest/          # Algorithm recommendation engine
│   │   ├── predict/          # Prediction endpoint
│   │   ├── downloader/       # Model file download
│   │   ├── models.py         # SQLAlchemy models
│   │   └── config.py         # App configuration
│   ├── app.py                # Entry point
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                 # React SPA
    └── src/
        ├── pages/            # Route-level components
        ├── components/       # Reusable UI components
        ├── api/              # Fetch wrappers per domain
        ├── reducers/         # Redux reducers (auth, train)
        └── constants/        # Page routes and API endpoints
```

---

## Supported Algorithms

| Algorithm | Best For |
|-----------|----------|
| K-Nearest Neighbors | Small datasets, low dimensionality, simple boundaries |
| Support Vector Machine | Medium datasets, complex decision boundaries |
| Decision Tree | Interpretable models, categorical-heavy data |
| Random Forest | Large datasets, high dimensionality, imbalanced classes |

The suggestion engine scores each algorithm against 7 dataset characteristics — size, dimensionality, class imbalance, target uniqueness, feature uniqueness, linear correlation, and non-linear relationships — and also factors in your past training history for the same dataset.

---

## License

MIT
