from app.models import Algorithm, Suggestion
from app.uploader.utils import check_file_is_available_return_path



























'''

import pandas as pd
from sklearn.metrics import accuracy_score
def calculate_feature_similarity(dataset, feature_columns, target_column, previous_trainings):
    highest_similarity = 0
    closest_trained = None

    # Iterate over previous training models
    for prev_training in previous_trainings:
        prev_feature_columns = prev_training["feature_columns"]
        prev_target_column = prev_training["target_column"]

        # Check if feature columns and target column are present in both datasets
        common_features = set(feature_columns) & set(prev_feature_columns)
        common_columns = common_features | {target_column, prev_target_column}

        if not common_features:
            continue  # No common features

        # Select common columns from both datasets
        current_data = dataset[common_columns].copy()
        prev_data = prev_training["dataset"][common_columns].copy()

        # Calculate similarity for each feature
        similarity_scores = []
        for feature in common_features:
            similarity = accuracy_score(current_data[feature], prev_data[feature])
            similarity_scores.append(similarity)

        # Calculate average similarity
        average_similarity = sum(similarity_scores) / len(similarity_scores)

        # Update the best model if the average similarity is higher
        if average_similarity > highest_similarity:
            highest_similarity = average_similarity
            closest_trained = prev_training

    return closest_trained, highest_similarity, 

# Example usage:
# Assuming you have a list of previous training models as follows:
# previous_trainings = [{"feature_columns": ["age", "bmi"], "target_column": "diabetes", "model": your_model1, "dataset": your_dataset1},
#                       {"feature_columns": ["glucose", "bmi"], "target_column": "diabetes", "model": your_model2, "dataset": your_dataset2},
#                       ...]
# You also need to provide the feature_columns, target_column, and dataset for the current training
# feature_columns_current = ["age", "bmi", "glucose"]
# target_column_current = "diabetes"
# current_dataset = your_current_dataset  # Replace with your actual dataset

# best_previous_model = calculate_feature_similarity(current_dataset, feature_columns_current, target_column_current, previous_trainings)
# print(f"Best Previous Model: {best_previous_model}")

import pandas as pd

def guess_algorithm(features, target):
    # Get the number of unique classes in the target variable
    num_classes = len(target.unique())

    # Get the number of features in the dataset
    num_features = features.shape[1]

    # Check if it's a binary classification problem
    is_binary_classification = num_classes == 2

    # Make a guess based on dataset characteristics
    if is_binary_classification:
        if num_features <= 20:
            return "K-Nearest Neighbors"
        elif num_features <= 50:
            return "SVM"
        else:
            return "Random Forest"
    else:
        return "Decision Tree"

# Example usage
dataset_path = 'path/to/your/dataset.csv'
guessed_algorithm = guess_algorithm(dataset_path)
print(f"The guessed algorithm for the dataset is '{guessed_algorithm}'.")



"""
corr
def calculate_correlation(features, target):
    # Concatenate features and target into a single DataFrame
    df = pd.concat([features, target], axis=1)

    # Calculate the correlation matrix
    correlation_matrix = df.corr()

    # Extract correlation values with the target variable
    target_correlations = correlation_matrix.iloc[:-1, -1]

    return target_correlations

def choose_best_algorithm(features, target):
    # Calculate correlations
    target_correlations = calculate_correlation(features, target)

    # Choose the algorithm with the highest absolute correlation
    best_algorithm = target_correlations.abs().idxmax()

    return best_algorithm
"""





def suggest_algorithm(user_id,dataset_id, feature_columns, target_column):
    algo_list_current = Algorithm.query.all()
    suggest_list = [] #algo_list_current[0],algo_list_current[1]]

    file_stat, file_data = check_file_is_available_return_path(dataset_id, user_id)
    if (not file_stat):
        return False, False, file_data
    
    prev_suggestions = Suggestion.query.filter_by(dataset_id=dataset_id).all()
    best_similarity = 0
    best_algorithm = None

    algo_list_current = [x.serialize() for x in algo_list_current]
    return True, algo_list_current, suggest_list    
    # return False


import pandas as pd

def suggest_algorithm(user_preferences, dataset_path, previous_training_path=None):
    # Load dataset
    dataset = pd.read_csv(dataset_path)

    # Extract user preferences
    preferred_algorithm = user_preferences.get("preferred_algorithm")
    interpretability_preference = user_preferences.get("interpretability")

    # Consider dataset characteristics
    dataset_size = len(dataset)
    num_features = len(dataset.columns) - 1  # Assuming the last column is the target
    similarity_threshold = 0.8  # Adjust this threshold based on your needs

    # Check if there's information from previous training
    if previous_training_path:
        previous_training = pd.read_csv(previous_training_path)
        
        # Check the similarity between feature columns and target column
        feature_similarity = calculate_feature_similarity(dataset, previous_training)
        
        # If similarity is high, consider the user's previous choice
        if feature_similarity > similarity_threshold:
            return previous_training["algorithm"].iloc[0]

    # Consider user preferences
    if interpretability_preference == "high":
        preferred_algorithm = "Decision Tree"  # More interpretable

    # If user has a specific preference, use that
    if preferred_algorithm:
        return preferred_algorithm

    # If no specific preference, suggest based on dataset characteristics
    if dataset_size > 10000 or num_features > 50:
        return "Random Forest"  # Large dataset or high-dimensional data
    else:
        return "Decision Tree"  # Default suggestion


# Example usage:
# user_preferences = {"preferred_algorithm": "SVM", "interpretability": "low"}
# dataset_path = "your_dataset.csv"
# previous_training_path = "user_previous_training.csv"  # Provide the path if available

# algorithm_suggestion = suggest_algorithm(user_preferences, dataset_path, previous_training_path)
# print(f"Suggested Algorithm: {algorithm_suggestion}")
'''


'''
    for suggestion in suggestions:
        similarity = calculate_similarity(feature_columns, target_column, suggestion.feature_columns, suggestion.target_column)

        if similarity > best_similarity:
            best_similarity = similarity
            best_algorithm = suggestion.suggested_algo_id

    return best_algorithm

    # KNN, SVM, DecisionTree, RandomForest
    return False


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

def calculate_similarity(feature_columns1, target_column1, feature_columns2, target_column2):
    text1 = f"{feature_columns1} {target_column1}"
    text2 = f"{feature_columns2} {target_column2}"

    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform([text1, text2])

    cosine_similarity = linear_kernel(tfidf_matrix, tfidf_matrix)[0][1]
    return cosine_similarity



#gfdxdfhfgh


from flask import Flask, request, jsonify
from app.models import Suggestion, User
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


def get_user_preferences(user_id):
    suggestions = Suggestion.query.join(User).filter(User.id == user_id).all()

    preferences = {}
    for suggestion in suggestions:
        preferences[suggestion.dataset_id] = suggestion.suggested_algo_id

    return preferences

def suggest_algorithm(user_id, dataset_id):
    for user in all_users:
        user_ids.append(user.id)
        user_preferences = get_user_preferences(user.id)
        row = [user_preferences.get(dataset_id, 0) for dataset_id in dataset_preferences]
        matrix.append(row)

    matrix = np.array(matrix)

    # Calculate similarity between users using cosine similarity
    similarity_matrix = cosine_similarity(matrix)

    # Find the user most similar to the current user
    user_index = user_ids.index(user_id)
    most_similar_user_index = np.argsort(similarity_matrix[user_index])[::-1][1]  # Exclude the user itself

    # Get the suggestions of the most similar user for the given dataset
    most_similar_user_preferences = get_user_preferences(user_ids[most_similar_user_index])
    suggestions_of_most_similar_user = [algo for algo, exists in most_similar_user_preferences.items() if exists]

    # Filter out suggestions already made by the current user
    suggestions_to_choose_from = list(set(suggestions_of_most_similar_user) - set(user_preferences.values()))

    if suggestions_to_choose_from:
        # Randomly select a suggestion from the remaining suggestions
        suggested_algorithm = np.random.choice(suggestions_to_choose_from)
        return suggested_algorithm
    else:
        return None
'''


'''
if ():
    reasons.push("noisy")
    suggest_score["KNN"]+=1
else:
    
    suggest_score["RF"]+=1
if ():
    reasons.push("imbalance")
    suggest_score["KNN"]+=1
else:
    
    suggest_score["RF"]+=1
if ():
    reasons.push("large dimension")
    suggest_score["KNN"]+=1
    suggest_score["KNN"]+=1
else:
    suggest_score["KNN"]+=1
    suggest_score["RF"]+=1
if ():
    reasons.push("target column is unique")
    suggest_score["KNN"]+=1
    suggest_score["KNN"]+=1
else:
    suggest_score["KNN"]+=1
    suggest_score["RF"]+=1
if ():
    reasons.push("feature columns are unique")
    suggest_score["KNN"]+=1
    suggest_score["KNN"]+=1
else:
    suggest_score["KNN"]+=1
    suggest_score["RF"]+=1
if ():
    reasons.push("correlation is high")
    suggest_score["KNN"]+=1
    suggest_score["KNN"]+=1
else:
    suggest_score["KNN"]+=1
    suggest_score["RF"]+=1
if ():
    reasons.push("relations are non linear")
    suggest_score["KNN"]+=1
    suggest_score["KNN"]+=1
else:
    suggest_score["KNN"]+=1
    suggest_score["RF"]+=1
'''