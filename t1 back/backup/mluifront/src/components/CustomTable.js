import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";

export default function CustomTable() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
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
              <Button onClick={() => setShowModal(true)} variant="primary">
                More info
              </Button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Linear Regression</td>
            <td>dataset1.csv</td>
            <td>96%</td>
            <td>{Date()}</td>
            <td>
              <Button onClick={() => setShowModal(true)} variant="primary">
                More info
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Model data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
            commodi aspernatur enim, consectetur. Cumque deleniti temporibus
            ipsam atque a dolores quisquam quisquam adipisci possimus
            laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
            accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
            reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
            deleniti rem!
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}
