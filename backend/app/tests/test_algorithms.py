import pytest
import os
import pandas as pd
import numpy as np
from app.train.train_algo.KNN import train_knn_model
from app.train.train_algo.SVM import train_svm_model
from app.train.train_algo.DecisionTree import train_decision_tree_model
from app.train.train_algo.RandomForest import train_random_forest_model
from app.train.utils import compute_metrics

SAMPLE_CSV = os.path.join(
    os.path.dirname(__file__), '..', '..', '..', 'sample_datasets', 'breast-cancer-data.csv'
)
TARGET = 'diagnosis'


@pytest.fixture()
def csv_path():
    return SAMPLE_CSV


@pytest.fixture()
def feature_columns(csv_path):
    df = pd.read_csv(csv_path)
    return [c for c in df.columns if c != TARGET]


def test_knn_trains_successfully(csv_path, feature_columns):
    ok, result, model, feats = train_knn_model(csv_path, TARGET, feature_columns[:5])
    assert ok is True
    assert 'accuracy' in result
    assert 0.0 <= result['accuracy'] <= 1.0
    assert model is not None


def test_svm_trains_successfully(csv_path, feature_columns):
    ok, result, model, feats = train_svm_model(csv_path, TARGET, feature_columns[:5])
    assert ok is True
    assert 'accuracy' in result


def test_decision_tree_trains_successfully(csv_path, feature_columns):
    ok, result, model, feats = train_decision_tree_model(csv_path, TARGET, feature_columns[:5])
    assert ok is True
    assert 'accuracy' in result


def test_random_forest_trains_successfully(csv_path, feature_columns):
    ok, result, model, feats = train_random_forest_model(csv_path, TARGET, feature_columns[:5])
    assert ok is True
    assert 'accuracy' in result


def test_knn_invalid_target_column(csv_path, feature_columns):
    ok, result, model, feats = train_knn_model(csv_path, 'nonexistent_column', feature_columns[:5])
    assert ok is False


def test_knn_custom_hyperparameter(csv_path, feature_columns):
    ok, result, model, feats = train_knn_model(
        csv_path, TARGET, feature_columns[:5],
        hyper_parameters={'k_neighbors': 7}
    )
    assert ok is True
    assert model.n_neighbors == 7


def test_compute_metrics_returns_all_keys():
    y_test = np.array([0, 1, 0, 1, 0])
    y_pred = np.array([0, 1, 1, 1, 0])
    metrics = compute_metrics(y_test, y_pred)
    for key in ('accuracy', 'precision', 'recall', 'f1', 'confusion_matrix'):
        assert key in metrics
    assert isinstance(metrics['confusion_matrix'], list)
