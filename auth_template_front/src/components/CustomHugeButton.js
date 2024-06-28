import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
function CustomHugeButton({
  title,
  description,
  iconSize = 35,
  iconSrc = "./favicon.svg",
  link_url,
}) {
  return (
    <Card className="card flex-row border-0 my-shadow-light rounded-4 overflow-hidden hover huge-button mx-3">
      <Link to={link_url}>
        <Card.Body className="p-3 pt-4">
          <img
            className="mb-2"
            alt="icon"
            src={iconSrc}
            height={iconSize}
            width={iconSize}
          />
          <h5>{title}</h5>
          <p>{description}</p>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default CustomHugeButton;
