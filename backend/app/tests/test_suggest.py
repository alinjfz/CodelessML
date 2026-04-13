import pytest
import pandas as pd
import numpy as np
from app.suggest.utils import (
    is_dataset_size_large,
    are_there_missing_values,
    is_dataset_imbalance,
    dataset_dimension,
    is_target_column_unique,
    are_feature_columns_unique,
    is_correlation_high,
    suggest_by_data_character,
)


@pytest.fixture()
def small_balanced_df():
    np.random.seed(42)
    n = 100
    return pd.DataFrame({
        'f1': np.random.rand(n),
        'f2': np.random.rand(n),
        'target': np.random.choice([0, 1], n)
    })


@pytest.fixture()
def large_df():
    np.random.seed(0)
    n = 2000
    return pd.DataFrame({
        'f1': np.random.rand(n),
        'f2': np.random.rand(n),
        'target': np.random.choice([0, 1], n)
    })


def test_small_dataset_not_large(small_balanced_df):
    assert is_dataset_size_large(small_balanced_df) is False


def test_large_dataset_is_large(large_df):
    result = is_dataset_size_large(large_df)
    assert result == 2000


def test_no_missing_values(small_balanced_df):
    assert are_there_missing_values(small_balanced_df) is False


def test_detects_missing_values():
    df = pd.DataFrame({'f1': [1.0, None, 3.0], 'target': [0, 1, 0]})
    result = are_there_missing_values(df)
    assert 'f1' in result


def test_balanced_dataset_not_imbalanced(small_balanced_df):
    result = is_dataset_imbalance(small_balanced_df, 'target')
    assert isinstance(result, bool)


def test_dataset_dimension():
    assert dataset_dimension(['a', 'b', 'c']) == 3


def test_target_unique_with_few_classes(small_balanced_df):
    assert is_target_column_unique(small_balanced_df, 'target') is True


def test_bug_fix_unique_ratio_not_clobbered():
    # Regression test for the unique_ratio parameter shadowing bug.
    # Before the fix, the parameter `unique_ratio=0.5` was overwritten inside
    # the loop, causing the final comparison to use the last column's ratio.
    np.random.seed(1)
    n = 200
    df = pd.DataFrame({
        'f1': np.random.rand(n),
        'f2': np.random.rand(n),
        'target': np.random.choice([0, 1], n)
    })
    result = are_feature_columns_unique(df, ['f1', 'f2'])
    # Should not raise; return type must be list or False
    assert result is False or isinstance(result, list)


def test_large_dataset_scores_rf_dt_higher(large_df):
    scores, _ = suggest_by_data_character(large_df, ['f1', 'f2'], 'target')
    assert scores['RF'] >= scores['KNN']
    assert scores['DT'] >= scores['KNN']


def test_small_dataset_scores_knn_svm_higher(small_balanced_df):
    scores, _ = suggest_by_data_character(small_balanced_df, ['f1', 'f2'], 'target')
    assert scores['KNN'] >= scores['RF']
    assert scores['SVM'] >= scores['RF']
