import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import * as TrainApi from "../api/train";
import mapAlgoName from "../utils/mapAlgoName";
import CustomChooseAlgorithmButton from "./CustomChooseAlgorithmButton";
import { BLOG_URL_PREFIX } from "../constants/routes";
import { Link } from "react-router-dom";

function CustomizeTrainSection({
  onSuggestAlgo,
  new_model,
  algo_list,
  trainLoading,
  trainError,
  trainActions,
  suggested_algorithm_object,
  onTrainIt,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    text: "",
    data: "",
  });

  const suggested_algorithm =
    (suggested_algorithm_object &&
      suggested_algorithm_object.char &&
      suggested_algorithm_object.char.suggest_list) ||
    [];
  /*
  const algorithm_data = [
    {
      id: "Backprop",
      name: "Backpropagation",
      short_description:
        "Backpropagation optimizes neural network weights by minimizing the difference between predicted and actual outcomes, crucial for supervised learning and deep neural networks.",
      icon: "/icons/Algorithms/Backprop.png",
      blog_url: "Backpropagation",
      description: `Backpropagation, short for "backward propagation of errors," is a foundational algorithm for training artificial neural networks. In supervised learning, it iteratively adjusts the weights of the network by minimizing the difference between predicted and actual outcomes. This optimization process enables the network to learn complex patterns and relationships within the data. Backpropagation involves two main steps: forward propagation, where input data is passed through the network to produce predictions, and backward propagation, where errors are calculated and used to update the weights. This iterative process continues until the model achieves satisfactory accuracy.`,
    },
    {
      id: "LinReg",
      name: "Linear Regression",
      short_description:
        "Linear Regression models relationships between variables, making it fundamental for statistical modeling, predictive analysis, and understanding linear dependencies within datasets.",
      icon: "/icons/Algorithms/LR.png",
      blog_url: "linear-regression",
      description:
        "Linear Regression is a versatile statistical method used for modeling the relationship between a dependent variable and one or more independent variables. It assumes a linear connection between the variables and aims to find the best-fit line that minimizes the sum of squared differences between observed and predicted values. Linear Regression is widely applied in various fields, including economics, finance, biology, and engineering. Its simplicity and interpretability make it a fundamental tool for predictive analysis and gaining insights into the linear relationships within datasets.",
    },
    {
      id: "KNN",
      name: "K-Nearest Neighbors (KNN)",
      short_description:
        "KNN (K-Nearest Neighbors), an instance-based learning algorithm, predicts outcomes based on the majority class or average of the k-nearest data points in feature space.",
      icon: "/icons/Algorithms/KNN.png",
      blog_url: "KNN",
      description:
        "K-Nearest Neighbors (KNN) is a versatile and intuitive algorithm used for both classification and regression tasks. In classification, KNN predicts the class of a data point based on the majority class among its k-nearest neighbors. In regression, it predicts the value by averaging the values of the k-nearest neighbors. KNN relies on the assumption that similar data points tend to have similar labels or values. It is non-parametric, making it suitable for a wide range of applications where the underlying data distribution may be unknown or complex.",
    },
    {
      id: "SVM",
      name: "Support Vector Machine (SVM)",
      blog_url: "SVM",
      short_description:
        "SVM, a classification algorithm, constructs a hyperplane to maximize the margin between classes in high-dimensional spaces, excelling in complex decision boundary scenarios.",
      icon: "/icons/Algorithms/SVM.png",
      description: `Support Vector Machine (SVM) is a powerful supervised learning algorithm used for classification and regression tasks. SVM aims to find the optimal hyperplane in a high-dimensional space that best separates data points into distinct classes. The "support vectors" are the data points that lie closest to the decision boundary, and the margin is the distance between the support vectors of different classes. SVM is effective in scenarios with complex decision boundaries and is known for its ability to handle both linear and non-linear relationships. It is widely used in image classification, text categorization, and bioinformatics.`,
    },
  ];
  */
  const get_suggested_algorithm = async function suggested_algo() {
    if (
      typeof onSuggestAlgo === "function" &&
      new_model &&
      new_model.dataset_id &&
      new_model.feature_columns &&
      new_model.target_column
    ) {
      const x = {
        dataset_id: new_model.dataset_id,
        feature_columns: new_model.feature_columns,
        target_column: new_model.target_column,
      };
      await onSuggestAlgo(x);
    }
  };

  const train_it_with_data = async function train_the_model(algo_name) {
    if (
      typeof onTrainIt === "function" &&
      new_model &&
      new_model.dataset_id &&
      new_model.feature_columns &&
      new_model.target_column
    ) {
      const x = {
        dataset_id: new_model.dataset_id,
        feature_columns: new_model.feature_columns,
        target_column: new_model.target_column,
      };
      // const algo_name = new_model.train_algo_name;
      await onTrainIt(x, algo_name);
      if (typeof trainActions.train_set_new_model === "function") {
        await trainActions.train_set_new_model({
          train_algo_name: algo_name,
          progress: 3,
        });
      }
    }
  };
  useEffect(() => {
    // if (new_model) {
    get_suggested_algorithm();
    // }

    return () => {};
  }, []);

  // dataset_id, feature_columns, target_column,
  // suggested_algorithm
  const other_algo_list = algo_list.filter((el) => {
    let isAvail = false;
    if (
      suggested_algorithm &&
      suggested_algorithm.length > 0 &&
      typeof suggested_algorithm.forEach === "function"
    )
      suggested_algorithm.forEach((item) => {
        if (item.id === el.id) isAvail = true;
      });
    return !isAvail;
  });
  const confirmed_modal = () => {
    const blog_url = confirmModalData.data;
    train_it_with_data(mapAlgoName(blog_url));
  };
  const clearConfirmModalData = () => {
    setShowConfirmModal(false);
    setConfirmModalData({ text: "", data: "" });
  };
  const onAlgoClick = (item) => {
    if (
      typeof trainActions.train_set_new_model === "function" &&
      item &&
      item.name
    ) {
      setShowConfirmModal(true);
      setConfirmModalData({
        text: `Do you want to use ${item.name} for training?`,
        data: item.blog_url,
      });
    }
  };
  const other_algorithms_chooser_component =
    other_algo_list && other_algo_list.length > 0 ? (
      <>
        <Row>
          <Col lg={6}>
            <h4>Other Algorithms:</h4>
          </Col>
        </Row>

        <CustomChooseAlgorithmButton
          items={other_algo_list}
          onClick={onAlgoClick}
        />
      </>
    ) : null;

  /*
     <Col lg={4} className="d-flex justify-content-center" key={el.id}>
              <CustomCard
                className="my-4"
                key={el.id}
                {...el}
                onClick={() => onAlgoClick(el)}
              />
            </Col>
    */
  const suggested_algorithms_chooser_component =
    suggested_algorithm && suggested_algorithm.length > 0 ? (
      <>
        <Row>
          <Col lg={6}>
            <h4 className="customize-train-h4">
              <Badge onClick={() => setShowModal(true)} pill bg="secondary">
                i
              </Badge>{" "}
              Suggested Algorithms:
            </h4>
          </Col>
          <Modal
            show={showConfirmModal}
            onHide={clearConfirmModalData}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Choosing Training Algorithm</Modal.Title>
            </Modal.Header>
            <Modal.Body>{confirmModalData.text}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={clearConfirmModalData}>
                Close
              </Button>
              <Button onClick={confirmed_modal} variant="primary">
                Choose
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            dialogClassName="modal-90w"
            fullscreen="lg-down"
            className="why-algo"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                Why do we suggest these algorithms
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Our machine learning platform's algorithm suggestion tool is
                designed to offer personalized recommendations by thoroughly
                analyzing your dataset's unique characteristics and considering
                your historical training choices. The tool assesses key
                attributes such as dataset size, dimensions, noise, imbalance,
                and correlation, ensuring that the suggested algorithms align
                with your data's inherent nature. Incorporating insights from
                your past algorithm preferences and prioritizing models with
                proven accuracies on similar datasets, the system aims to
                provide reliable and effective suggestions. Additionally, your
                feedback plays a crucial role in refining the tool's
                recommendations, fostering a collaborative and evolving user
                experience. Ultimately, the algorithm suggestion tool is geared
                towards empowering you with informed decision-making,
                transparently guiding your machine learning journey for optimal
                results.
              </p>
              <Link to={BLOG_URL_PREFIX + "Why-Suggestion"}>
                <div className="d-flex flex-row justify-content-center align-items-center">
                  <p className="learn-more ml-2 mb-0">Learn More</p>
                  <img
                    src={"./icons/link.svg"}
                    height={16}
                    width={16}
                    alt="link"
                  />
                </div>
              </Link>
            </Modal.Body>
          </Modal>
        </Row>
        <CustomChooseAlgorithmButton
          onClick={onAlgoClick}
          items={suggested_algorithm}
        />
        {/* {suggested_algorithm.length > 0 && suggested_algorithm.length <= 2 ? (
            <Col hidden lg></Col>
          ) : null} */}
      </>
    ) : null;
  const tryAgainHandle = () => {
    get_suggested_algorithm();
  };
  if (trainLoading)
    return (
      <Row>
        <Col
          className="d-flex flex-row justify-content-center"
          xxl={5}
          xl={6}
          lg={7}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>
      </Row>
    );
  if (trainError) {
    return (
      <Row className="d-flex flex-row justify-content-center">
        <Col xxl={5} xl={6} lg={7}>
          <Alert
            className="mt-2 d-flex justify-content-between align-items-center"
            variant="danger"
          >
            Error getting the suggestion
            <Button onClick={tryAgainHandle} variant="primary">
              Try Again
            </Button>
          </Alert>
        </Col>
      </Row>
    );
  }
  return (
    <Row className="d-flex flex-row justify-content-center">
      {suggested_algorithms_chooser_component}
      {other_algorithms_chooser_component}
    </Row>
  );
}

const mapStateToProps = (state) => ({
  loading: state.train && state.train.loading ? true : false,
  trainLoading: state.train && state.train.loading,
  new_model: state.train && state.train.new_model,
  trainError: state.train && state.train.error,
  suggested_algorithm_object:
    (state.train &&
      state.train.new_model &&
      state.train.new_model.suggested_algorithm) ||
    {},
  algo_list: (state.train && state.train.algo_list) || [],
});

const mapDispatchToProps = (dispatch) => {
  return {
    onTrainIt: (data, algo_name) =>
      TrainApi.api_train_it(data, algo_name)(dispatch, {}),
    onSuggestAlgo: (data) => TrainApi.api_suggest_algorithm(data)(dispatch, {}),
    trainActions: bindActionCreators(TrainActions, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomizeTrainSection);
