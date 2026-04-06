import React from "react";
import { API_ROUTE_PREFIX, DOWNLOAD_PREFIX } from "../constants/ApiRoutes";

export default function ModelDownloadLink({ link, children }) {
  //   <Button
  //   onClick={() => trigger_prediction(el.id)}
  //   variant="dark"
  // >
  //   Download
  // </Button>
  return (
    <a
      href={API_ROUTE_PREFIX + DOWNLOAD_PREFIX + link}
      alt="Download Model"
      download
      rel="noreferrer"
      target="_blank"
    >
      {children ? children : "Download"}
    </a>
  );
}
