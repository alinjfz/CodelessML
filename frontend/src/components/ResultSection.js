import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import * as TrainApi from "../api/train";
import TrainedTable from "./TrainedTable";
import { Button, Col, Row, Table } from "react-bootstrap";
import ModelDownloadLink from "./ModelDownloadLink";
import { PREDICT_URL, TRAIN_LIST_URL } from "../constants/routes";
import { Link, Navigate } from "react-router-dom";

function ResultSection({
  new_model,
  trainActions,
  onTrainList,
  train_list,
  algo_list,
}) {
  const get_train_list = async function trained_list() {
    if (typeof onTrainList === "function") {
      await onTrainList();
    }
  };
  const [gotoPrediction, setGotoPrediction] = useState(false);

  useEffect(() => {
    get_train_list();
    return () => {};
  }, []);
  const trigger_prediction = (id) => {
    if (typeof trainActions.train_predict_data === "function" && id) {
      trainActions.train_predict_data({ train_id: id });
      setGotoPrediction(true);
    }
  };
  if (gotoPrediction) return <Navigate to={PREDICT_URL} replace={true} />;

  const showModelData = () => {
    const sorted_data = [...train_list].sort((t1, t2) => {
      if (!t1.training_date || !t2.training_date) return 0;
      return new Date(t2.training_date) - new Date(t1.training_date);
    });
    const data = sorted_data[0];
    let res = <></>;
    let t_id = "";
    let t_model_path = "";
    if (!data) return null;
    let val = null;
    for (let [key, value] of Object.entries(data)) {
      if (key === "id") {
        t_id = value;
      }
      if (key === "model_path") {
        t_model_path = value;
      }
      if (key === "model_path" || key === "id") continue;
      if (!value) val = "-";
      else if (typeof value === "object") {
        val = JSON.stringify(value);
      } else val = value;
      res = (
        <>
          {res}
          <tr>
            <td>
              <strong>{key}</strong>
            </td>
            <td>
              <span>{val}</span>
            </td>
          </tr>
        </>
      );
    }
    res = (
      <>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Column</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>{res}</tbody>
        </Table>
        <div className="trained-table-modal-btns d-flex flex-row justify-content-between align-items-center">
          <ModelDownloadLink link={t_model_path}>
            <Button variant="dark">Download</Button>
          </ModelDownloadLink>
          <Button onClick={() => trigger_prediction(t_id)} variant="primary">
            Predict Some Data
          </Button>
          <Link to={TRAIN_LIST_URL}>
            <Button variant="dark">Go To Trained List</Button>
          </Link>
        </div>
      </>
    );
    return res;
  };
  return (
    <>
      <Row className="d-flex flex-row justify-content-center">
        <Col className="mt-4" xxl={5} xl={6} lg={7}>
          <h3>The Model Trained Successfully!</h3>
        </Col>
      </Row>
      <Row className="d-flex flex-row justify-content-center">
        <Col xxl={5} xl={6} lg={7}>
          {showModelData()}
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  loading: state.train && state.train.loading ? true : false,
  algo_list: (state.train && state.train.algo_list) || [],
  new_model: state.train && state.train.new_model,
  train_list: (state.train && state.train.train_list) || [],
});

const mapDispatchToProps = (dispatch) => {
  return {
    onTrainList: () => TrainApi.api_train_list()(dispatch, {}),
    trainActions: bindActionCreators(TrainActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResultSection);
