import os
import pandas as pd
from flask import jsonify

from app.models import FileStorage

def get_file_size(file_path):
    try:
        # Get the size of the file in bytes
        size_in_bytes = os.path.getsize(file_path)

        # Convert bytes to kilobytes for readability
        # size_in_kb = size_in_bytes / 1024
        return size_in_bytes
    except FileNotFoundError:
        return False  # Handle the case where the file is not found
    except Exception as e:
        return False # Handle other exceptions

def check_file_is_available_return_path(dataset_id, user_id):
    data_item = FileStorage.query.filter_by(id=dataset_id).first()
    if (not data_item):
        return False, {'error' : 'Dataset not available'}
    if (data_item.user_id != user_id):
        return False, jsonify({'error': 'Dataset permission error'})
    file_path = data_item.get_file_dir_and_name()
    file_size = get_file_size(file_path)
    
    if (data_item.size > file_size or file_size == 0):
        return False, {'error' : 'File size is not correct' }
    return True, file_path

def check_corr(dataset, correlation_threshold=0.3):
    correlation_matrix = dataset.corr().abs()
    correlated_features = []

    for i in range(len(correlation_matrix.columns)):
        for j in range(i):
            if correlation_matrix.iloc[i, j] > correlation_threshold:
                feature_pair = (correlation_matrix.iloc[i, j],correlation_matrix.columns[i], correlation_matrix.columns[j])
                correlated_features.append(feature_pair)
    # is_high_corr = len(correlated_features_target) >= len_corr
    # is_high_corr
    return correlated_features

def analyze_csv(file_path):
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file_path)

        # Extract column names and their frequencies
        column_names = df.columns.tolist()

        # Extract some sample rows
        sample_rows = df.head().to_dict(orient='records')
        correlated_features = check_corr(df)
        result = {
            "dataset_analysis" : {
                'column_names': column_names,
                'sample_rows': sample_rows,
                'correlated_features':correlated_features,
            }
        }

        return True, result
    except Exception as e:
        return False, {'error': str(e)}
