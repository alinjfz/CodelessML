import React from "react";
import ViewCSV from "./ViewCSV";
import { Col, Row } from "react-bootstrap";

export default function ChooseFeatureSection() {
  return (
    <Row className="d-flex flex-row justify-content-center">
      <Col>
        <ViewCSV />
      </Col>
    </Row>
  );
}
