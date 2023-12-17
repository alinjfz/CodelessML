import React from "react";
import CustomTable from "../components/CustomTable";
import { Col, Row } from "react-bootstrap";

export default function TrainListPage() {
  return (
    <Row>
      <Col>
        <CustomTable />
      </Col>
    </Row>
  );
}
