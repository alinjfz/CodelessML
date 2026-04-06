from flask import json
import pandas as pd
from app.models import Algorithm, Suggestion, TrainingHistory
from app.uploader.utils import check_file_is_available_return_path


def pick_algorithm_by_abbr_name(name):
    res = None
    if (name == "KNN"):
        res = "K-Nearest Neighbors (KNN)"
    elif (name == "SVM"):
        res = "Support Vector Machine (SVM)"
    elif (name == "DT"):
        res = "Decision Tree"
    elif (name == "RF"):
        res = "Random Forest"
    if (not res):
        return None
    algo = Algorithm.query.filter_by(name=res).first()
    if (algo):
        return algo.serialize()
    return None


def serialized_algorithms_list():
    algo_list_current = Algorithm.query.all()
    return [x.serialize() for x in algo_list_current]


def load_dataset(dataset_id, user_id):
    file_stat, file_data = check_file_is_available_return_path(
        dataset_id, user_id)
    if (not file_stat):
        return False, file_data
    try:
        dataset = pd.read_csv(file_data)
    except Exception as e:
        return False, e
    return True, dataset


def is_dataset_size_large(dataset, threshold=1000):
    dataset_size = dataset.shape[0]
    if dataset_size > threshold:
        return dataset_size
    return False


def are_there_missing_values(dataset):
    missing_values = dataset.isnull().sum()
    filtered_missings = {key: value for key,
                         value in missing_values.items() if value > 0}
    if (len(filtered_missings) > 0):
        return filtered_missings
    return False


def is_dataset_imbalance(dataset, target_column, imbalance_threshold=0.2):
    class_distribution = dataset[target_column].value_counts(normalize=True)
    is_imbalanced = any(class_distribution < imbalance_threshold)
    return is_imbalanced


def dataset_dimension(feature_columns):
    return len(feature_columns)


def is_target_column_unique(dataset, target_column, uniqueness_threshold=3):
    num_unique_values = dataset[target_column].nunique()
    is_target_unique = num_unique_values <= uniqueness_threshold
    return is_target_unique


def are_feature_columns_unique(dataset, feature_columns, uniqueness_threshold=0.95, unique_ratio=0.5):
    unique_features = []
    for column in feature_columns:
        # Skip non-categorical columns
        if dataset[column].dtype == 'O':  # Assuming categorical features are of type 'object'
            continue

        # Calculate the proportion of unique values in the feature column
        unique_ratio = dataset[column].nunique() / dataset.shape[0]

        # Check if the feature is considered unique based on the threshold
        if unique_ratio <= uniqueness_threshold:
            unique_features.append(column)
    are_unique = len(unique_features) / len(feature_columns) < unique_ratio
    if (are_unique):
        return unique_features
    return False


def is_correlation_high(dataset, feature_columns, target_column, correlation_threshold=0.8, len_corr=1):
    columns_to_check = feature_columns + [target_column]

    # Subset the DataFrame
    subset_df = dataset[columns_to_check]

    correlation_matrix = subset_df.corr().abs()
    # Find pairs of highly correlated features and the target
    correlated_features_target = []

    for feature in feature_columns:
        if correlation_matrix.loc[feature, target_column] > correlation_threshold:
            feature_target_pair = (feature, target_column)
            correlated_features_target.append(feature_target_pair)
    is_high_corr = len(correlated_features_target) >= len_corr
    if (is_high_corr):
        return correlated_features_target
    return False


def are_relations_non_linear(dataset, feature_columns, target_column, correlation_threshold=0.8, len_corr=1):
    columns_to_check = feature_columns + [target_column]
    # Subset the DataFrame
    subset_df = dataset[columns_to_check]
    spearman_corr_matrix = subset_df.corr(method='spearman')
    # Find pairs of highly correlated features and the target
    correlated_features_target = []
    for feature in feature_columns:
        if spearman_corr_matrix.loc[feature, target_column] > correlation_threshold:
            feature_target_pair = (feature, target_column)
            correlated_features_target.append(feature_target_pair)
    is_high_corr = len(correlated_features_target) >= len_corr
    if (is_high_corr):
        return correlated_features_target
    return False


def suggest_by_data_character(dataset, feature_columns, target_column):
    suggest_score = {"KNN": 0, "SVM": 0, "DT": 0, "RF": 0}
    reasons = {}
    large = is_dataset_size_large(dataset)
    missing = are_there_missing_values(dataset)
    imbalance = is_dataset_imbalance(dataset, target_column)
    h_dim = dataset_dimension(feature_columns)
    tar_q = is_target_column_unique(dataset, target_column)
    fer_q = are_feature_columns_unique(dataset, feature_columns)
    corr = is_correlation_high(dataset, feature_columns, target_column)
    rel_l = are_relations_non_linear(dataset, feature_columns, target_column)

    if (large):
        reasons["large"] = large
        suggest_score["RF"] += 1
        suggest_score["DT"] += 1
    else:
        reasons["large"] = False
        suggest_score["KNN"] += 1
        suggest_score["SVM"] += 1

    if (missing):
        reasons["missing"] = missing
    else:
        reasons["missing"] = False

    if (imbalance):
        reasons["imbalance"] = True
        suggest_score["RF"] += 1
        suggest_score["DT"] += 1
        suggest_score["SVM"] += 1
    else:
        reasons["imbalance"] = False
        suggest_score["KNN"] += 1

    if (h_dim < 20):
        reasons["dim"] = h_dim
        suggest_score["KNN"] += 1
    elif (h_dim <= 50):
        reasons["dim"] = h_dim
        suggest_score["SVM"] += 1
    else:
        reasons["dim"] = h_dim
        suggest_score["DT"] += 1
        suggest_score["RF"] += 1

    if (tar_q):
        # target_column_continuous_wide_range
        reasons["target_column_unique"] = True
        suggest_score["KNN"] += 1
        suggest_score["SVM"] += 1
    else:
        reasons["target_column_unique"] = False

    if (fer_q):
        reasons["feature_column_unique"] = fer_q
        suggest_score["RF"] += 1
        suggest_score["DT"] += 1
    else:
        reasons["feature_column_unique"] = False
        suggest_score["KNN"] += 1
        suggest_score["SVM"] += 1

    if (corr):
        reasons["corr"] = corr
        suggest_score["RF"] += 1
        suggest_score["DT"] += 1
    else:
        reasons["corr"] = False
        suggest_score["KNN"] += 1
        suggest_score["SVM"] += 1

    if (rel_l):
        reasons["non_linear_relation"] = rel_l
        suggest_score["RF"] += 1
        suggest_score["DT"] += 1
    else:
        reasons["non_linear_relation"] = False
        suggest_score["KNN"] += 1
        suggest_score["SVM"] += 1
    return suggest_score, reasons


def suggest_based_on_scores(suggest_score):
    suggest_list = []
    sorted_scores = sorted(
        suggest_score, key=suggest_score.get, reverse=True)[:2]
    suggest_list.append(pick_algorithm_by_abbr_name(sorted_scores[0]))
    if (suggest_score[sorted_scores[0]] == suggest_score[sorted_scores[1]]):
        suggest_list.append(pick_algorithm_by_abbr_name(sorted_scores[1]))
    return suggest_list

def pick_algorithm_by_id(algo_list):
    res = []
    item = {}
    for algo in algo_list:
        item = Algorithm.query.filter_by(id=algo.id).first()
        res.append(item)
    if (len(res) == 1):
        return res[0].serialize()
    return [x.serialize() for x in res]

def suggest_based_on_prev_suggest(dataset_id, user_id, feature_columns, target_column):
    prev_suggests = (
        Suggestion.query
        .filter_by(user_id=user_id, dataset_id=dataset_id, target_column=target_column)
        .all()
    )
    prev_suggest_result = []
    for suggestItem in prev_suggests:
        feature_columns_list = json.loads(suggestItem.feature_columns)
        common_items_count = len(
            set(feature_columns_list) & set(feature_columns))
        if (common_items_count > 0 and common_items_count > len(feature_columns) / 2):
            prev_suggest_result.append({
                "suggest_id": suggestItem.id,
                "suggested_algo_id": suggestItem.suggested_algo_id,
                'common_items_count': common_items_count,
            })
    sorted_result_by_commmon = sorted(prev_suggest_result, key=lambda x: (
        x['common_items_count']), reverse=True)
    if (len(sorted_result_by_commmon) == 0):
        return False
    result = pick_algorithm_by_id([sorted_result_by_commmon[0]])
    return {"prev_suggested": result}

def suggest_based_on_prev_train(dataset_id, user_id, feature_columns, target_column):
    # prev_suggestions = Suggestion.query.filter_by(dataset_id=dataset_id).all()
    # prev_trains = TrainingHistory.query.filter_by(dataset_id=dataset_id).all()
    prev_trainings = (
        TrainingHistory.query
        .filter_by(user_id=user_id, dataset_id=dataset_id)
        .order_by(TrainingHistory.accuracy.desc())
        .all()
    )
    prev_train_result = []
    for training in prev_trainings:
        feature_columns_list = json.loads(training.feature_columns)
        common_items_count = len(
            set(feature_columns_list) & set(feature_columns))
        common_target_column = len(
            set(training.target_column) & set(target_column))
        if (common_target_column):
            prev_train_result.append({
                "train_id": training.id,
                "algo_id": training.algo_id,
                'accuracy': training.accuracy,
                'common_items_count': common_items_count,
            })
    sorted_result_by_commmon = sorted(prev_train_result, key=lambda x: (
        x['common_items_count'], x['accuracy']), reverse=True)
    sorted_result_by_accuracy = sorted(prev_train_result, key=lambda x: (
        x['accuracy'], x['common_items_count']), reverse=True)
    highest_acc = ""
    closest_highest = ""
    if (len(sorted_result_by_accuracy) > 0):
        highest_acc = pick_algorithm_by_id([sorted_result_by_accuracy[0]])
    if (len(sorted_result_by_commmon) > 0):
        closest_highest = pick_algorithm_by_id([sorted_result_by_commmon[0]])
    return {"highest_accuracy": highest_acc, "closest_highest": closest_highest}

def suggest_algorithm(user_id, dataset_id, feature_columns, target_column):
    dataset_stat, dataset = load_dataset(dataset_id, user_id)
    if (not dataset_stat):
        return False, False, dataset
    if (target_column not in dataset.columns):
        return False, False, f'Target column not found in dataset'
    for feature_column in feature_columns:
        if (feature_column not in dataset.columns):
            return False, False, f'Feature column {feature_column} not found in dataset'
    # Data Character
    suggest_score, reasons = suggest_by_data_character(
        dataset, feature_columns, target_column)
    suggest_list = suggest_based_on_scores(suggest_score)
    # Suggest based on prev trains
    trained_suggest = suggest_based_on_prev_train(
        user_id, dataset_id, feature_columns, target_column)
    # Suggest based on prev suggests
    suggested_suggest = suggest_based_on_prev_suggest(
        user_id, dataset_id, feature_columns, target_column)

    info = {
        "char":{
            "suggest_list": suggest_list,
            "suggest_score": suggest_score,
            "reasons": reasons
        },
        "trained": trained_suggest,
        "prev_suggest": suggested_suggest,
    }
    print("THEINFO", info)
    return True, serialized_algorithms_list(), info

'''
item = {'char': {'suggest_list': [<Algorithm 84fcccf7bf1345ab85abebf80152f224>, <Algorithm 2c6ca7443d8b488ab017d2888d94f708>], 'suggest_score': {'KNN': 5, 'SVM': 5, 'DT': 1, 'RF': 1}, 'reasons': {'large': False, 'missing': False, 'imbalance': False, '20<=dim<=50': 30, 'target_column_unique': True, 'feature column': ['radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean', 'smoothness_mean', 'compactness_mean', 'concavity_mean', 'symmetry_mean', 'fractal_dimension_mean', 'radius_se', 'texture_se', 'perimeter_se', 'area_se', 'concavity_se', 'concave points_se', 'symmetry_se', 'radius_worst', 'texture_worst', 'perimeter_worst', 'smoothness_worst', 'compactness_worst', 'concavity_worst', 'concave points_worst', 'symmetry_worst', 'fractal_dimension_worst'], 'corr high': False, 'non linear relation': False}}, 'trained': {'highest_accuracy': '', 'closest_highest': ''}, 'prev_suggest': False}
'''