import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import * as TrainApi from "../api/train";
import TrainedTable from "../components/TrainedTable";
import { Col, Row } from "react-bootstrap";

function TrainListPage({
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
  useEffect(() => {
    get_train_list();
    return () => {};
  }, []);

  return (
    <>
      <Row>
        <Col className="mt-3" xxl={5} xl={6} lg={7}>
          <h3>Trained Models List:</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <TrainedTable />
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
export default connect(mapStateToProps, mapDispatchToProps)(TrainListPage);
