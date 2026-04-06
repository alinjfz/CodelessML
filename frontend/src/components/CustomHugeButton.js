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
    // <Card className={`custom-card ${className ? className : ""}`} {...props}>
    //   <Link to={BLOG_URL_PREFIX + blog_url}>
    //     <Card.Img variant="top" src={icon} alt={id} height={ImgHeight} />
    //     <Card.Body>
    //       <Card.Title>{name}</Card.Title>
    //       {short_description ? (
    //         <Card.Text>{short_description}</Card.Text>
    //       ) : null}
    //       {/* <div className="d-flex flex-column justify-content-center"> */}
    //       <div>
    //         {onClick ? (
    //           <Button onClick={onClick} variant="primary">
    //             Choose for training
    //           </Button>
    //         ) : null}
    //         <p className="learn-more">Learn More</p>
    //       </div>
    //     </Card.Body>
    //   </Link>
    // </Card>
  );
}

export default CustomHugeButton;
