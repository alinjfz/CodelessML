import React from "react";
import FileUploader from "../components/FileUploader";
import { Col, Row } from "react-bootstrap";

export default function UploadSection(props) {
  return (
    <Row className="d-flex flex-row justify-content-center">
      <Col xxl={5} xl={6} lg={7}>
        <FileUploader />
      </Col>
    </Row>
  );
}
