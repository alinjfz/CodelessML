import { Button } from "react-bootstrap";

const filesizes = (bytes, decimals = 2) => {
  if (bytes === 0 || !bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
const fileMapper = (
  file,
  onDeleteFile = false,
  idprefix = false,
  downloadable = false,
  selectable = false
) => {
  if (!file) return "";
  // eslint-disable-next-line
  const { id, filename, filetype, fileimage, upload_date, size } = file;
  // eslint-disable-next-line
  let file_extension = new RegExp(/\.([0-9a-z]+)(?:[\?#]|$)/i).exec(filename);
  file_extension =
    file_extension && file_extension.length > 0 ? file_extension[1] : "";
  return (
    <div className="file-atc-box" key={idprefix + id}>
      <div
        className="file-image"
        style={downloadable ? { backgroundColor: "lightgreen" } : {}}
      >
        {file_extension}
        <i className="far fa-file-alt"></i>
      </div>
      <div className="file-detail">
        <h6>{filename}</h6>
        <p className="lh-base">
          <span>Size : {filesizes(size)}</span>
          <br />
          <span className="ml-3">Modified Time : {upload_date}</span>
        </p>
        <div className="file-actions">
          {onDeleteFile ? (
            <Button
              variant="primary"
              className="file-action-btn"
              onClick={() => onDeleteFile(id)}
            >
              Delete
            </Button>
          ) : null}
          {downloadable ? (
            <a href={fileimage} className="file-action-btn" download={filename}>
              Download
            </a>
          ) : null}
        </div>
      </div>
      {selectable ? (
        <Button variant="primary" onClick={() => selectable(id)}>
          Choose
        </Button>
      ) : null}
    </div>
  );
};
const MultipleFilesMapper = (
  files,
  onDeleteFile = false,
  idprefix = false,
  downloadable = false,
  selectable = false
) => {
  let result = [];
  result = [...files].sort((t1, t2) => {
    if (!t1.upload_date || !t2.upload_date) return 0;
    return new Date(t2.upload_date) - new Date(t1.upload_date);
  });
  // files.sort(
  //   (file1, file2) => Date(file1.upload_date) - Date(file2.upload_date)
  // );
  // files.forEach((item) => {
  //   result.unshift(
  //     fileMapper(item, onDeleteFile, idprefix, downloadable, selectable)
  //   );
  // });
  result = result.map((item) =>
    fileMapper(item, onDeleteFile, idprefix, downloadable, selectable)
  );
  return result;
};
export { MultipleFilesMapper, fileMapper, filesizes };
