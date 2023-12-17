import React, { useState } from "react";
import CustomCard from "../components/CustomCard";
import { Row, Col, Breadcrumb } from "react-bootstrap";
import FileUploader from "../components/FileUploader";

export default function NewModelPage() {
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
  const breadcrump_data = [
    {
      id: 0,
      text: "Choose Algorithm",
      link: "",
    },
    {
      id: 1,
      text: "Customize Train",
      link: "",
    },
    {
      id: 2,
      text: "Result",
      link: "",
    },
  ];
  const [progress, setProgress] = useState(0);
  const breadcrumb_component = (
    <Row>
      <Col>
        <Breadcrumb>
          {breadcrump_data.map((el) => (
            <Breadcrumb.Item
              onClick={() => setProgress(el.id)}
              key={"breadcrumb-no-" + el.id}
              active={el.id === progress}
            >
              {el.text}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </Col>
    </Row>
  );
  const algorithms_chooser_component = (
    <Row>
      {algorithm_data.map((el) => (
        <Col key={el.id}>
          <CustomCard {...el} onClick={() => setProgress(1)} />
        </Col>
      ))}
    </Row>
  );
  return (
    <>
      {breadcrumb_component}
      {progress === 0 ? (
        algorithms_chooser_component
      ) : progress === 1 ? (
        <FileUploader />
      ) : null}
    </>
  );
}
