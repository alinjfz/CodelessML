export default function mapAlgoName(algo_name) {
  switch (algo_name) {
    case "KNN":
      return "KNN";
    case "SVM":
      return "SVM";
    case "DecisionTree":
      return "DecisionTree";
    case "RandomForest":
      return "RandomForest";
    default:
      return "KNN";
  }
}
