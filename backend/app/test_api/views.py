from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

from app.algorithm.views import algo_list
from app import db

from app.models import Algorithm

test = Blueprint('test',__name__)

'''
            API               | Complete |          NOTES
-------------------------------------------------------------------
test:                         |          |
    test                      |   done   |      
    privatetest               |   done   |      
'''

@test.route('/', methods=['GET'])
def test_api():
    return jsonify({'message' : 'server is up!'})

@test.route('/privatetest', methods=['GET'])
@login_required
def privatetest_api():
    return jsonify({'message' : 'private server is up!'})

@test.route('/add-algo', methods=['POST'])
@login_required
def add_algo_test():
    db.session.query(Algorithm).delete()
    db.session.commit()
    algo_list_current = Algorithm.query.filter_by(name="Support Vector Machine (SVM)").first()
    if (algo_list_current):
        algo_list_current = Algorithm.query.all()
        algo_list_current = [x.serialize() for x in algo_list_current]
        return jsonify({'message':"the list already exists", 'algo_list' : algo_list_current}), 200
    
    algo_list = [
    {
      'id': "Backprop",
      'name': "Backpropagation",
      'short_description':
        "Backpropagation optimizes neural network weights by minimizing the difference between predicted and actual outcomes, crucial for supervised learning and deep neural networks.",
      'icon': "/icons/Algorithms/Backprop.png",
      'blog_url': "Backpropagation",
      'description': "Backpropagation, short for \"backward propagation of errors,\" is a foundational algorithm for training artificial neural networks. In supervised learning, it iteratively adjusts the weights of the network by minimizing the difference between predicted and actual outcomes. This optimization process enables the network to learn complex patterns and relationships within the data. Backpropagation involves two main 'steps': forward propagation, where input data is passed through the network to produce predictions, and backward propagation, where errors are calculated and used to update the weights. This iterative process continues until the model achieves satisfactory accuracy.",
    },
    {
      'id': "LinReg",
      'name': "Linear Regression",
      'short_description':
        "Linear Regression models relationships between variables, making it fundamental for statistical modeling, predictive analysis, and understanding linear dependencies within datasets.",
      'icon': "/icons/Algorithms/LR.png",
      'blog_url': "linear-regression",
      'description':
        "Linear Regression is a versatile statistical method used for modeling the relationship between a dependent variable and one or more independent variables. It assumes a linear connection between the variables and aims to find the best-fit line that minimizes the sum of squared differences between observed and predicted values. Linear Regression is widely applied in various fields, including economics, finance, biology, and engineering. Its simplicity and interpretability make it a fundamental tool for predictive analysis and gaining insights into the linear relationships within datasets.",
    },
    {
      'id': "KNN",
      'name': "K-Nearest Neighbors (KNN)",
      'short_description':
        "KNN (K-Nearest Neighbors), an instance-based learning algorithm, predicts outcomes based on the majority class or average of the k-nearest data points in feature space.",
      'icon': "/icons/Algorithms/KNN.png",
      'blog_url': "KNN",
      'description':
        "K-Nearest Neighbors (KNN) is a versatile and intuitive algorithm used for both classification and regression tasks. In classification, KNN predicts the class of a data point based on the majority class among its k-nearest neighbors. In regression, it predicts the value by averaging the values of the k-nearest neighbors. KNN relies on the assumption that similar data points tend to have similar labels or values. It is non-parametric, making it suitable for a wide range of applications where the underlying data distribution may be unknown or complex.",
    },
    {
      'id': "SVM",
      'name': "Support Vector Machine (SVM)",
      'blog_url': "SVM",
      'short_description':
        "SVM, a classification algorithm, constructs a hyperplane to maximize the margin between classes in high-dimensional spaces, excelling in complex decision boundary scenarios.",
      'icon': "/icons/Algorithms/SVM.png",
      'description': "Support Vector Machine (SVM) is a powerful supervised learning algorithm used for classification and regression tasks. SVM aims to find the optimal hyperplane in a high-dimensional space that best separates data points into distinct classes. The \"support vectors\" are the data points that lie closest to the decision boundary, and the margin is the distance between the support vectors of different classes. SVM is effective in scenarios with complex decision boundaries and is known for its ability to handle both linear and non-linear relationships. It is widely used in image classification, text categorization, and bioinformatics.",
    },
    {
    'id': "DecisionTree",
    'name': "Decision Tree",
    'blog_url': "DecisionTree",
    'short_description':
        "Decision Tree, a versatile algorithm, recursively partitions data based on features, forming a tree structure to facilitate decision-making in classification and regression problems.",
    'icon': "/icons/Algorithms/DecisionTree.png",
    'description': "Decision Tree is a versatile machine learning algorithm used for both classification and regression tasks. It recursively partitions the dataset based on features, creating a tree-like structure where each internal node represents a decision based on a specific feature, and each leaf node represents the predicted outcome. Decision Trees are interpretable and suitable for handling both numerical and categorical data. They are widely used in various domains, including finance, healthcare, and natural language processing.",
    },
    {
    'id': "RandomForest",
    'name': "Random Forest",
    'blog_url': "RandomForest",
    'short_description':
        "Random Forest, an ensemble algorithm, combines multiple decision trees to enhance predictive accuracy and robustness, making it effective for various machine learning tasks.",
    'icon': "/icons/Algorithms/RandomForest.png",
    'description': "Random Forest is an ensemble learning algorithm that combines the power of multiple Decision Trees to improve overall predictive performance. It builds a collection of decision trees, each trained on a subset of the data and using a random subset of features. The final prediction is made by averaging or voting among the individual trees. Random Forest is known for its ability to handle complex relationships, mitigate overfitting, and provide feature importance rankings. It is widely used in applications such as classification, regression, and anomaly detection.",
    }]
    algo_model = []

    for x in algo_list:
        algo_model.append(Algorithm(x['name'], x['blog_url'], x['description'], x['short_description'], x['icon']))
    
    db.session.add_all(algo_model)
    db.session.commit()
    algo_list_current = Algorithm.query.all()
    algo_list_current = [x.serialize() for x in algo_list_current]
    return jsonify({'message' : 'Added', "algo_list": algo_list_current}), 200