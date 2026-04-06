import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import { Button, Modal, OverlayTrigger, Popover, Table } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { PREDICT_URL, NEW_MODEL_URL } from "../constants/routes";
import ModelDownloadLink from "./ModelDownloadLink";
import { SortUp, SortDown } from "react-bootstrap-icons";
function TrainedTable({ loading, algo_list, train_list, trainActions }) {
  const get_algo_name = (id) => {
    const res = algo_list.find((el) => el.id === id);
    if (res && res.name) {
      return res.name;
    }
    return;
  };

  /*
    accuracy: 0.7467532467532467
    algo_id: "32d83e5adccc435e810a6cf08e90a611"
    -cost: null
    dataset_id: "1457e3bedf6c4e58809683c6f6e3f115"
    feature_columns: null
    -hyper_parameters: 
    -id: "576b2ead1b8444829286041ae8165c01"
    -model_path: null
    target_column: "diabetes"
    training_date: "Wed, 22 Nov 2023 16:48:17 GMT"
 */
  const trigger_prediction = (id) => {
    if (typeof trainActions.train_predict_data === "function" && id) {
      trainActions.train_predict_data({ train_id: id });
      setGotoPrediction(true);
    }
  };
  const [gotoPrediction, setGotoPrediction] = useState(false);
  const [showModal, setShowModal] = useState({ show: false });
  const [sortBy, setSortBy] = useState({ key: "training_date", asc: true });
  const handleSortBy = (id) => {
    const prev = sortBy;
    if (prev.key === id) {
      const nextAsc = !prev.asc;
      setSortBy({ ...prev, asc: nextAsc });
    } else {
      setSortBy({ key: id, asc: true });
    }
  };
  const sortByIcon = (id) => {
    if (id === sortBy.key) {
      if (sortBy.asc) return <SortDown />;
      return <SortUp />;
    }
    return null;
  };
  const showModalData = () => {
    let res = <></>;
    let t_id = "";
    let t_model_path = "";
    const data = train_list.find((el) => el.id === showModal.show);
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
          <ModelDownloadLink link={t_model_path} />
          <Button onClick={() => trigger_prediction(t_id)} variant="primary">
            Predict Some Data
          </Button>
        </div>
      </>
    );
    return res;
  };
  if (gotoPrediction) return <Navigate to={PREDICT_URL} replace={true} />;
  const sort_train_list = () => {
    let res = [];
    if (train_list) {
      if (train_list.length < 2) res = train_list;
      else {
        if (sortBy.key === "training_date") {
          if (sortBy.asc)
            res = [...train_list].sort((t1, t2) => {
              if (!t1.training_date || !t2.training_date) return 0;
              return new Date(t2.training_date) - new Date(t1.training_date);
            });
          else
            res = [...train_list].sort((t1, t2) => {
              if (!t1.training_date || !t2.training_date) return 0;
              return new Date(t1.training_date) - new Date(t2.training_date);
            });
        } else if (sortBy.key === "accuracy") {
          const the_key = sortBy.key;
          if (sortBy.asc)
            res = [...train_list].sort((t1, t2) => t2[the_key] - t1[the_key]);
          else
            res = [...train_list].sort((t1, t2) => t1[the_key] - t2[the_key]);
        } else {
          const the_key = sortBy.key;
          if (sortBy.asc)
            res = [...train_list].sort((t1, t2) =>
              t1[the_key].localeCompare(t2[the_key])
            );
          else
            res = [...train_list].sort((t1, t2) =>
              t2[the_key].localeCompare(t1[the_key])
            );
        }
      }
    }
    return res;
  };
  const sorted_train_list = sort_train_list();
  return (
    <>
      <Table
        className="mt-2 my-clickable-table"
        responsive
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSortBy("training_date")}>
              Date Trained {sortByIcon("training_date")}
            </th>
            <th onClick={() => handleSortBy("accuracy")}>
              Accuracy {sortByIcon("accuracy")}
            </th>
            <th onClick={() => handleSortBy("algo_id")}>
              Algrithm {sortByIcon("algo_id")}
            </th>
            <th onClick={() => handleSortBy("feature_columns")}>
              Feature Columns
              {sortByIcon("feature_columns")}
            </th>
            <th onClick={() => handleSortBy("target_column")}>
              Target Column {sortByIcon("target_column")}
            </th>
            <th>Download</th>
            <th>Prediction</th>
            <th>More info</th>
          </tr>
        </thead>
        <tbody>
          {sorted_train_list.length === 0 ? (
            <tr>
              <td colSpan={9}>
                <h6 className="text-center">
                  You have not trained a model yet!{" "}
                  <Link to={NEW_MODEL_URL}>Train A Model</Link>
                </h6>
              </td>
            </tr>
          ) : (
            sorted_train_list.map((el, i) => (
              <tr key={el.id}>
                <td>{i + 1}</td>
                <td>{el.training_date}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    key={"overlay-" + el.id}
                    overlay={
                      <Popover id={`tooltip-${el.id}`}>
                        <Popover.Body>{el.accuracy * 100 + "%"}</Popover.Body>
                      </Popover>
                    }
                  >
                    {({ ref, ...triggerHandler }) => (
                      <span
                        {...triggerHandler}
                        ref={ref}
                        className="mytable-accuracy"
                      >
                        {(el.accuracy * 100).toFixed(2)}%
                      </span>
                    )}
                  </OverlayTrigger>
                </td>
                <td>{get_algo_name(el.algo_id)}</td>
                {/* <td>FileName</td> */}
                <td>{el.feature_columns}</td>
                <td>{el.target_column}</td>
                <td>
                  <ModelDownloadLink link={el.model_path} />
                </td>
                <td>
                  <Button
                    onClick={() => trigger_prediction(el.id)}
                    variant="dark"
                  >
                    Predict
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={() => setShowModal({ show: el.id })}
                    variant="primary"
                  >
                    More
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Modal
        show={showModal.show}
        onHide={() => setShowModal({ show: false })}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Model data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{showModal.show ? showModalData() : null}</Modal.Body>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  loading: state.train && state.train.loading ? true : false,
  algo_list: (state.train && state.train.algo_list) || [],
  train_list: (state.train && state.train.train_list) || [],
});

const mapDispatchToProps = (dispatch) => {
  return {
    trainActions: bindActionCreators(TrainActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TrainedTable);

/*
  const getRowData = (data) => {
    const row_data = [];
    if (data) {
      for (let name in data) {
        if (
          name !== "dataset_id" &&
          name !== "id" &&
          name !== "hyper_parameters" &&
          name !== "cost" &&
          name !== "model_path"
        ) {
          if (name === "accuracy") {
            row_data.unshift(data[name].toFixed(5));
          } else if (name === "algo_id") {
            row_data.unshift(get_algo_name(data[name]));
          } else if (name === "feature_columns") {
            if (!data[name]) row_data.unshift("All Columns");
            else row_data.unshift(data[name]);
          } else row_data.unshift(data[name]);
        }
      }
    }
    return row_data;
  };
  let cols = train_list[0],
    column_names = [];
  if (cols) {
    for (let name in cols) {
      if (
        name !== "dataset_id" &&
        name !== "id" &&
        name !== "hyper_parameters" &&
        name !== "cost" &&
        name !== "model_path"
      ) {
        if (name === "algo_id") {
          column_names.unshift("Algorithm Name");
        } else column_names.unshift(name);
      }
    }
  }
  return (
        <thead>
          <tr>
            <th>#</th>
            {column_names.map((item, j) => (
              <th key={"tr-li-h-" + j}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {train_list.map((el, i) => (
            <tr key={el.id}>
              <th>{i + 1}</th>
              {getRowData(el).map((item, index) => (
                <th key={"shd-" + index}>{item}</th>
              ))}
            </tr>
          ))}
        </tbody>
  );
*/
