import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BLOG_URL_PREFIX } from "../constants/routes";
function CustomCard({ id, name, short_description, icon, blog_url, onClick }) {
  return (
    <Card className=" my-4" style={{ width: "18rem" }}>
      <Card.Img variant="top" src={icon} alt={id} height={170} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{short_description}</Card.Text>
        <div className="d-flex flex-column justify-content-center">
          <Button onClick={onClick} variant="primary">
            Choose for training
          </Button>
          <Link className="text-center" to={BLOG_URL_PREFIX + blog_url}>
            <Button variant="Secondary">Learn More</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;
