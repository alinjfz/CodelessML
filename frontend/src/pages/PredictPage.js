import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import * as PredictApi from "../api/predict";
import * as TrainApi from "../api/train";
import { TRAIN_LIST_URL } from "../constants/routes";
import { Navigate } from "react-router-dom";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
function PredictPage({
  trainActions,
  trainError,
  trainMessage,
  predict,
  onTrainList,
  onPredictData,
  train_list,
  trainLoading,
}) {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const clear_predicted = () => {
    if (
      predict &&
      predict.prediction !== false &&
      typeof trainActions.train_predict_data === "function"
    ) {
      trainActions.train_predict_data({ prediction: false });
    }
  };
  const clear_train_error = () => {
    if (
      trainActions &&
      typeof trainActions.train_clear_error === "function" &&
      (trainError || trainMessage)
    ) {
      trainActions.train_clear_error();
    }
  };
  const predict_the_data = async function predfunc() {
    if (typeof onPredictData === "function") {
      const y = [];
      for (const key in formData) {
        y.push(Number(formData[key]));
      }
      const x = {
        train_id: predict.train_id,
        user_data: { ...formData },
      };
      await onPredictData(x);
    }
  };
  const get_train_list = async function trained_list() {
    if (typeof onTrainList === "function") {
      await onTrainList();
    }
  };
  const get_train_data = () => {
    const t_id = predict.train_id;
    if (!t_id) return false;
    if (!train_list || train_list.length === 0) return false;
    const t_data = train_list.find((el) => el.id === t_id);
    return t_data;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    for (const key in formData) {
      if (!formData[key]) {
        errors[key] = key + " is required";
      }
    }
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Form is valid, you can submit it or perform further actions
      predict_the_data();
    }
  };
  useEffect(() => {
    if (trainError || trainMessage) {
      clear_train_error();
    }
    clear_predicted();
    if (!predict.train_id) {
      return;
    } else if (train_list.length === 0) {
      get_train_list();
    }
    // eslint-disable-next-line
  }, []);
  // train_id
  // user_data
  //   predict: {
  //     train_id: "",
  //     user_data: {},
  //     prediction: {},
  //   },
  const train_data = get_train_data();
  if (!train_data) return <Navigate to={TRAIN_LIST_URL} replace={true} />;
  const onCloseAlert = () => {
    clear_train_error();
    clear_predicted();
  };
  // accuracy: 0.6688311688311688
  // algo_id:
  // cost: null
  // dataset_id:
  // feature_columns: "["pregnancies", "glucose", "insulin", "bmi", "age"]"
  // hyper_parameters:
  // id:
  // model_path: ""
  // target_column: "diabetes"
  // training_date: "Thu, 30 Nov 2023 19:11:49 GMT"
  const create_predict_form = (train_data) => {
    let features = train_data.feature_columns || ""; // || [];
    if (features.length < 4)
      return <Navigate to={TRAIN_LIST_URL} replace={true} />;
    features = features
      .slice(1, features.length - 1)
      .replaceAll('"', "")
      .replaceAll(" ", "");
    features = features.split(`,`);
    if (features.length !== Object.keys(formData).length) {
      const dict = features.reduce(
        (o, key) => Object.assign(o, { [key]: "" }),
        {}
      );
      setFormData({ ...dict });
    }
    if (!formData) return null;
    return (
      <form>
        {features.map((item, i) => (
          <div key={"predict-form-item" + i} className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${formErrors[item] ? "is-invalid" : ""}`}
              id={"floatingInput-" + i}
              disabled={trainLoading}
              name={item}
              placeholder="Some data"
              onChange={handleChange}
              value={formData[item]}
            />
            {formErrors[item] && (
              <div className="invalid-feedback">{formErrors[item]}</div>
            )}
            <label htmlFor="floatingInput">{item}</label>
          </div>
        ))}
        <Button
          variant="primary"
          size="lg"
          className="btn-login fw-bold"
          type="submit"
          onClick={handleSubmit}
          disabled={trainLoading}
        >
          {trainLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            "Predict"
          )}
        </Button>
        {trainError ? (
          <Alert
            className="mt-3"
            variant="danger"
            onClose={onCloseAlert}
            dismissible
          >
            {trainError}
          </Alert>
        ) : predict.prediction !== false ? (
          <Alert
            className="mt-3"
            variant="success"
            onClose={onCloseAlert}
            dismissible
          >
            The predicted data i: {predict.prediction}
          </Alert>
        ) : null}
      </form>
    );
  };
  return (
    <Row>
      <Col className="col-lg-10 col-xl-8 mx-auto">
        <Card className="card flex-row border-0 shadow rounded-3 overflow-hidden">
          <Card.Body className="p-4 p-sm-5">
            <Card.Title className="">
              <h2>Prediction</h2>
            </Card.Title>
            {create_predict_form(train_data)}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

const mapStateToProps = (state) => ({
  trainError: state.train.error,
  trainMessage: state.train.message,
  trainLoading: state.train.loading,
  predict: state.train && state.train.predict,
  train_list: (state.train && state.train.train_list) || [],
});

const mapDispatchToProps = (dispatch) => {
  return {
    trainActions: bindActionCreators(TrainActions, dispatch),
    onTrainList: () => TrainApi.api_train_list()(dispatch, {}),
    onPredictData: (data) => PredictApi.api_predict_data(data)(dispatch, {}),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PredictPage);
