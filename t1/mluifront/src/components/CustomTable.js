import React from "react";
import { Button, Table } from "react-bootstrap";

export default function CustomTable() {
  return (
    <Table className="mt-5" striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Algrithm</th>
          <th>FileName</th>
          <th>Accuracy</th>
          <th>Date Modified</th>
          <th>More info</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Backpropagation</td>
          <td>dataset1.csv</td>
          <td>95%</td>
          <td>{Date()}</td>
          <td>
            <Button variant="primary">More info</Button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Linear Regression</td>
          <td>dataset1.csv</td>
          <td>96%</td>
          <td>{Date()}</td>
          <td>
            <Button variant="primary">More info</Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
