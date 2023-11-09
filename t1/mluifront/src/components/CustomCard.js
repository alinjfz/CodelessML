import { Button, Card } from "react-bootstrap";

function CustomCard(props) {
  return (
    <Card className=" my-4" style={{ width: "18rem" }}>
      <Card.Img variant="top" src="/icons/backpropagation.png" />
      <Card.Body>
        <Card.Title>Backpropagation</Card.Title>
        <Card.Text>
          Backpropagation, or backward propagation of errors, is an algorithm
          that is designed to test for errors working back from output nodes to
          input nodes. It's an important mathematical tool for improving the
          accuracy of predictions in data mining and machine learning.
        </Card.Text>
        <div className="d-flex flex-column justify-content-center">
          <Button variant="primary">Choose for training</Button>
          <Button variant="Secondary">Learn More</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;
