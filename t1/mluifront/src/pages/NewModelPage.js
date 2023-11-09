import React from "react";
import CustomCard from "../components/CustomCard";
import { Row, Col, Breadcrumb } from "react-bootstrap";

export default function NewModelPage() {
  return (
    <>
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item active>Choose Algorithm</Breadcrumb.Item>
            <Breadcrumb.Item disabled>Customize Train</Breadcrumb.Item>
            <Breadcrumb.Item disabled>Result</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomCard />
        </Col>
        <Col>
          <CustomCard />
        </Col>
        <Col>
          <CustomCard />
        </Col>
        <Col>
          <CustomCard />
        </Col>
      </Row>
    </>
  );
}
