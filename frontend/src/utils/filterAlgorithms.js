function filterAlgorithms(list) {
  const res = [];
  list.forEach((item) => {
    if (item.blog_url === "KNN") res.push(item);
    if (item.blog_url === "SVM") res.push(item);
    if (item.blog_url === "DecisionTree") res.push(item);
    if (item.blog_url === "RandomForest") res.push(item);
  });
  return res;
}
export default filterAlgorithms;
