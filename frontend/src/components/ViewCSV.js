import React, { useEffect, useState } from "react";
import { Button, Row, Table, Spinner, Alert, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import * as UploadApi from "../api/upload";

function ViewCSV({
  trainActions,
  new_model,
  onAnalysisDataset,
  dataset_analysis,
  trainLoading,
  trainError,
}) {
  const {
    column_names = [],
    sample_rows = [],
    correlated_features = [],
  } = dataset_analysis || {
    column_names: [],
    sample_rows: [],
    correlated_features: [],
  };
  const [selection, setSelection] = useState([]);
  const [selectTarget, setSelectTarget] = useState(-1);
  const [corrFeatures, setCorrFeatures] = useState([]);
  const isHighlyCorrelatedWithTargetClass = (index) => {
    if (index < 0 || index > column_names.length || corrFeatures.length === 0)
      return false;
    const feature_name = column_names[index];
    const find_it = corrFeatures.findIndex((item) => {
      if (item.length === 3) {
        if (item[1] === feature_name || item[2] === feature_name) return true;
      }
      return false;
    });
    if (find_it !== -1) {
      return corrFeatures[find_it];
    }
    return false;
    // see if this is one of them
  };
  const whatIsTheCorr = (index) => {
    if (index !== selectTarget) {
      const corr = isHighlyCorrelatedWithTargetClass(index);

      if (corr && corr.length === 3) {
        const corr_num = corr[0].toFixed(4);
        return corr_num;
      }
    }
    return;
  };
  const setCorrelatedWithTargetClass = (index) => {
    if (index === -1) {
      setCorrFeatures([]);
      return;
    }
    const target_name = column_names[index];
    const filtered_corr = correlated_features.filter((item) => {
      if (item.length === 3) {
        if (item[1] === target_name || item[2] === target_name) return true;
      }
      return false;
    });
    const sorted_corr = [...filtered_corr].sort((t1, t2) => t2[0] - t1[0]);
    setCorrFeatures(sorted_corr);
  };
  const isSelectedClass = (index) => {
    if (selectTarget === index) return "table-danger";
    if (selection.indexOf(index) !== -1) return "table-success";
    if (isHighlyCorrelatedWithTargetClass(index)) return "table-warning";
    return "";
  };
  const pushItToNewModel = (x) => {
    if (typeof trainActions.train_set_new_model === "function") {
      trainActions.train_set_new_model(x);
    }
  };
  const get_dataset_analysis = async function data_analyze_func() {
    if (
      typeof onAnalysisDataset === "function" &&
      new_model &&
      new_model.dataset_id
    ) {
      const x = { dataset_id: new_model.dataset_id };
      await onAnalysisDataset(x);
    }
  };
  const tryAgainHandle = () => {
    get_dataset_analysis();
  };
  const set_all_as_feature = () => {
    if (selectTarget !== -1) {
      const features = column_names.filter((item, i) => i !== selectTarget);
      const sl = [];
      for (let i = 0; i < column_names.length; i++) {
        if (i !== selectTarget) sl.push(i);
      }
      setSelection([...sl]);
      pushItToNewModel({
        target_column: column_names[selectTarget],
        feature_columns: features,
      });
    }
  };
  useEffect(() => {
    get_dataset_analysis();
    pushItToNewModel({ target_column: "", feature_columns: [] });
    return () => {};
  }, []);
  const clear_target_col = () => {
    setSelectTarget(-1);
    setCorrelatedWithTargetClass(-1);
  };
  const onSelectHandler = (i) => {
    if (selectTarget === i) {
      setSelectTarget(-1);
      setCorrelatedWithTargetClass(-1);
      pushItToNewModel({ target_column: "" });
      return;
    }
    const sl = [...selection];
    const findit = sl.indexOf(i);
    if (selectTarget === -1 && findit === -1) {
      setSelectTarget(i);
      setCorrelatedWithTargetClass(i);
      pushItToNewModel({ target_column: column_names[i] });
      return;
    }
    if (findit !== -1) {
      sl.splice(findit, 1);
    } else {
      sl.push(i);
    }
    const features = sl.map((i) => column_names[i]);
    setSelection(sl);
    pushItToNewModel({ feature_columns: features });
  };
  const clear_btns = (
    <div className="d-flex justify-content-between my-2">
      <Button
        onClick={() => setSelection([])}
        disabled={selection && selection.length === 0}
        variant="danger"
      >
        Clear Features
      </Button>
      <Button
        onClick={set_all_as_feature}
        disabled={selectTarget === -1}
        variant="success"
      >
        Select All as Feature Columns
      </Button>
      <Button
        onClick={clear_target_col}
        disabled={selectTarget === -1}
        variant="danger"
      >
        Clear Target Column
      </Button>
    </div>
  );
  if (trainLoading)
    // <Spinner animation="border" role="status">
    //   <span className="visually-hidden">Loading...</span>
    // </Spinner>
    return (
      <div className="d-flex flex-row justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  if (trainError || !dataset_analysis) {
    return (
      <>
        <Alert
          className="mt-2 d-flex justify-content-between align-items-center"
          variant="danger"
        >
          Error Analysing the dataset
          <Button onClick={tryAgainHandle} variant="primary">
            Try Again
          </Button>
        </Alert>
      </>
    );
  }
  return (
    <>
      <Row className="viewCSV">
        <h2 className="mt-3">
          Please select the {selectTarget === -1 ? "target column" : "features"}
        </h2>
      </Row>
      <Table
        className="my-clickable-table all-clickable"
        responsive
        striped
        bordered
        hover
      >
        <thead>
          <tr key={"header"}>
            {column_names.map((key, index) => (
              <th
                className={isSelectedClass(index)}
                onClick={() => onSelectHandler(index)}
                key={"hd-" + index}
              >
                {key}
              </th>
            ))}
          </tr>
          <tr key={"header-corr"}>
            {column_names.map((key, index) => (
              <th
                className={isSelectedClass(index)}
                onClick={() => onSelectHandler(index)}
                key={"hd-" + index}
              >
                {index === 0 ? "Corr:" : null}
                {whatIsTheCorr(index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sample_rows.map((rowItem, i) => (
            <tr key={"tr-" + i}>
              {
                // Object.values(rowItem).map((val, j) => (
                column_names.map((val, j) => (
                  <td
                    className={isSelectedClass(j)}
                    onClick={() => onSelectHandler(j)}
                    key={"td-" + i + "-" + j}
                  >
                    {rowItem[val]}
                  </td>
                ))
              }
            </tr>
          ))}
          <tr>
            {column_names.map((val, index) => (
              <td
                className={isSelectedClass(index)}
                onClick={() => onSelectHandler(index)}
                key={"etc-row-" + index}
              >
                ...
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
      {clear_btns}
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            {selectTarget !== -1 ? <th>Target Column</th> : null}
            {selection.map((index, j) => (
              <th key={"shd-" + index}>F-{j + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {selectTarget !== -1 ? <td>{column_names[selectTarget]}</td> : null}
            {selection.map((index) => (
              <td key={"shd-" + index}>{column_names[index]}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </>
  );
}

const mapStateToProps = (state) => ({
  new_model: state.train && state.train.new_model,
  trainError: state.train && state.train.error,
  trainLoading: state.train && state.train.loading,
  dataset_analysis:
    state.train &&
    state.train.new_model &&
    state.train.new_model.dataset_analysis,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onAnalysisDataset: (data) =>
      UploadApi.api_analysis_dataset(data)(dispatch, {}),
    trainActions: bindActionCreators(TrainActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewCSV);
