import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BLOG_URL_PREFIX } from "../constants/routes";
function CustomCard({
  id,
  name,
  short_description,
  description,
  icon,
  blog_url,
  link,
  onClick,
  className,
  ImgHeight = 170,
  ...props
}) {
  return (
    <Card
      {...props}
      className={
        "border-0 my-shadow-light rounded-4 overflow-hidden hover mx-3 custom-post-button " +
        className
          ? className
          : ""
      }
    >
      {icon ? (
        <Card.Img variant="top" src={icon} alt={id} height={ImgHeight} />
      ) : null}
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        {short_description ? <Card.Text>{short_description}</Card.Text> : null}
        {/* <div className="d-flex flex-column justify-content-center"> */}
        <div>
          <Button onClick={onClick} className="mb-3" variant="primary">
            Choose for training
          </Button>

          {link ? (
            { link }
          ) : (
            <Link to={BLOG_URL_PREFIX + blog_url}>
              <p className="learn-more">Learn More</p>
            </Link>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;
