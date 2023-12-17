import React, { useState } from "react";
// import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import { motion } from "framer-motion";
// import { Button } from "react-bootstrap";
const CustomComponent = () => {
  const [selectedfile, setSelectedFile] = useState(null);
  // const [uploadStatus, setUploadStatus] = useState(null);
  const [Files, SetFiles] = useState(null);
  const [animation, setAnimation] = useState(false);
  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const onInputChange = (e) => {
    const targetFile = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        id: "the_uploading_id",
        filename: targetFile.name,
        filetype: targetFile.type,
        fileimage: reader.result,
        datetime: targetFile.lastModifiedDate.toLocaleString("en-US"),
        filesize: filesizes(targetFile.size),
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
      SetFiles({ ...selectedfile });
      setSelectedFile(null);
    } else {
      alert("Please select file");
    }
  };

  const deleteFile = async (id) => {
    if (window.confirm("Are you sure you want to delete this file?"))
      SetFiles(null);
  };
  const fileMapper = (file, onDeleteFile, idprefix, downloadable = false) => {
    if (!file) return "";
    // eslint-disable-next-line
    const { id, filename, filetype, fileimage, datetime, filesize } = file;
    // eslint-disable-next-line
    let file_extension = ""; //new RegExp(/\.([0-9a-z]+)(?:[\?#]|$)/i).exec(filename);
    file_extension = file_extension.length > 0 ? file_extension[1] : "";
    return (
      <div className="file-atc-box">
        <div
          className="file-image"
          style={downloadable ? { backgroundColor: "lightgreen" } : {}}
        >
          {file_extension}
          <i className="far fa-file-alt"></i>
        </div>
        <div className="file-detail">
          <h6>{filename}</h6>
          <p>
            <span>Size : {filesize}</span>
            <span className="ml-3">Modified Time : {datetime}</span>
          </p>
          <div className="file-actions">
            <button
              className="file-action-btn"
              onClick={() => onDeleteFile(id)}
            >
              Delete
            </button>
            {downloadable ? (
              <a
                href={fileimage}
                className="file-action-btn"
                download={filename}
              >
                Download
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  };
  const mappedSelectedFiles = fileMapper(
    selectedfile,
    deleteSelectedFile,
    "selected-file-",
    false
  );
  const mappedFilesList = Files ? (
    <div className="kb-attach-box">
      <hr />
      {fileMapper(Files, deleteFile, "uploaded-file-", true)}
    </div>
  ) : (
    ""
  );
  const result = (
    <div className="fileupload-view">
      <div className="row justify-content-center m-0">
        <div className="col-md-6">
          <div className="card mt-5">
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
                  <div className="kb-attach-box mb-3">
                    {mappedSelectedFiles}
                  </div>
                  <div className="kb-buttons-box">
                    <button
                      type="submit"
                      className="btn btn-primary form-submit"
                    >
                      Upload
                    </button>
                  </div>
                </form>
                {mappedFilesList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const shakeAnimation = {
    initial: { scale: 1, x: 0, y: 0 },
    animate: { rotate: [0, 3, -3, 3, -3, 3, 0] },
    transition: {
      ease: "linear",
      duration: 0.5,
    },
  };
  const entering_transition = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.1,
      ease: [0, 0.7, 0.2, 1.0],
      scale: {
        type: "spring",
        damping: 8,
        stiffness: 100,
        restDelta: 0.001,
      },
    },
  };
  const button_animation = {
    transition: { type: "spring", stiffness: 400, damping: 17 },
    whileTap: { scale: 0.9 },
  };

  const animation_num = animation
    ? { ...shakeAnimation }
    : { ...entering_transition };
  return (
    <>
      <motion.div className="container" {...animation_num}>
        {result}
      </motion.div>
      <motion.button
        className="btn btn-primary"
        onClick={() => {
          const i = !animation;
          setAnimation(i);
        }}
        {...button_animation}
      >
        Again
      </motion.button>
    </>
  );
};
export default CustomComponent;
