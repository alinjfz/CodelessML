import React, { useEffect, useState } from "react";
import { fileMapper, MultipleFilesMapper } from "../utils/fileMapper";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as UploadApi from "../api/upload";
import * as TrainActions from "../actions/train";

const FileUploader = ({
  trainError,
  trainMessage,
  onGetUploadList,
  onUploadData,
  trainActions,
  upload_list,
}) => {
  const [selectedfile, setSelectedFile] = useState(null);
  // const [uploadStatus, setUploadStatus] = useState(null);
  const [theFile, SetTheFile] = useState(null);
  const clear_train_error = () => {
    if (
      trainActions &&
      typeof trainActions.train_clear_error === "function" &&
      (trainError || trainMessage)
    ) {
      trainActions.train_clear_error();
    }
  };
  const get_upload_list = async function uplistfunc() {
    if (typeof onGetUploadList === "function") {
      await onGetUploadList();
    }
  };
  const upload_a_file = async function upfilefunc() {
    if (typeof onUploadData === "function") {
      const formData = new FormData();
      formData.append("file", theFile);
      // const x = {
      //   file: theFile,
      // };
      await onUploadData(formData);
    }
  };
  const clear_upload_list = () => {
    // if (typeof onGetUploadList === "function") {
    //   await onGetUploadList();
    //   trainActions
    // }
  };
  useEffect(() => {
    if (trainError || trainMessage) {
      clear_train_error();
      clear_upload_list();
    }
    get_upload_list();
    // eslint-disable-next-line
  }, []);
  const onInputChange = (e) => {
    const targetFile = e.target.files[0];
    SetTheFile(targetFile);
    let reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        id: "the_uploading_id",
        filename: targetFile.name,
        filetype: targetFile.type,
        fileimage: reader.result,
        upload_date: targetFile.lastModifiedDate.toLocaleString("en-US"),
        size: targetFile.size,
        targetFile,
      });
    };
    if (targetFile) {
      reader.readAsDataURL(targetFile);
    }
    // // Check if a file is selected
    // if (targetFile) {
    //   setSelectedFile(targetFile);
    //   setUploadStatus(null); // Clear previous upload status
    // } else {
    //   setSelectedFile(null);
    //   setUploadStatus("No file selected");
    // }
  };

  const deleteSelectedFile = () => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setSelectedFile(null);
    }
  };

  const onFileUploadSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    if (selectedfile && selectedfile.id) {
      upload_a_file();
      setSelectedFile(null);
    } else {
      alert("Please select file");
    }
  };

  const mappedSelectedFiles = fileMapper(
    selectedfile,
    deleteSelectedFile,
    "selected-file-",
    false
  );
  // let mappedFilesList = Files ? (
  //   <div className="kb-attach-box">
  //     <hr />
  //     {fileMapper(Files, deleteFile, "uploaded-file-", true)}
  //   </div>
  // ) : (
  //   ""
  // );
  const tryAgainHandle = () => {
    if (upload_list && upload_list.length > 0) upload_a_file();
    else get_upload_list();
  };
  const selectForNextStep = (id) => {
    if (typeof trainActions.train_set_new_model === "function") {
      const up = upload_list.find((el) => el.id === id);
      trainActions.train_set_new_model({
        dataset_id: id,
        progress: 1,
        dataset: up,
      });
    }
  };
  const mappedFilesList =
    upload_list && upload_list.length > 0 ? (
      <div className="kb-attach-box">
        <div className="kb-data-title mt-3">
          <h6>Uploaded Files</h6>
        </div>
        <hr />
        <div className="kb-uploaded-before">
          {MultipleFilesMapper(
            upload_list,
            false,
            "up-files-",
            false,
            selectForNextStep
          )}
        </div>
      </div>
    ) : (
      ""
    );
  let alertComponent = <></>;
  if (trainError)
    alertComponent = (
      <>
        <Alert
          className="mt-2 d-flex justify-content-between align-items-center"
          variant="danger"
        >
          {trainError === "error"
            ? "Please check your internet connection"
            : trainError}
          <Button onClick={tryAgainHandle} size="sm" variant="primary">
            Try Again
          </Button>
        </Alert>
      </>
    );
  /*
    else if (trainMessage)
    <Alert
      className="mt-2"
      variant="danger"
      onClose={clear_train_error}
      dismissible
    >
      {trainMessage}
    </Alert>;\
    className="col-sm-12 col-lg-8 col-xl-6"
    */
  const result = (
    <div className="fileupload-view">
      <Row className="justify-content-center m-0">
        <Col className="p-0">
          <div className="card mt-3">
            <div className="card-body">
              <div className="kb-data-box">
                <div className="kb-modal-data-title">
                  <div className="kb-data-title">
                    <h6>Select your dataset file</h6>
                  </div>
                </div>
                <form onSubmit={onFileUploadSubmit}>
                  <div className="kb-file-upload">
                    <div className="file-upload-box">
                      <input
                        type="file"
                        id="fileupload"
                        className="file-upload-input"
                        onChange={onInputChange}
                        multiple
                      />
                      <span>
                        Drag and drop or{" "}
                        <span className="file-link">Choose your files</span>
                      </span>
                    </div>
                  </div>
                  {alertComponent}
                  <div className="kb-attach-box mb-3">
                    {mappedSelectedFiles}
                  </div>
                  <div className="kb-buttons-box text-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="form-submit"
                    >
                      Upload
                    </Button>
                  </div>
                </form>
                {mappedFilesList}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
  return <div className="file-uploader">{result}</div>;
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  authError: state.auth.error,
  authMessage: state.auth.message,
  trainError: state.train.error,
  trainMessage: state.train.message,
  loggedin: state.auth.loggedin,
  upload_list: state.train.upload_list || [],
  loading: state.auth.loading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onUploadData: (data) => UploadApi.api_upload_data(data)(dispatch, {}),
    onGetUploadList: () => UploadApi.api_upload_list()(dispatch, {}),
    trainActions: bindActionCreators(TrainActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FileUploader);
