import { Link } from "react-router-dom";
import { BLOG_URL_PREFIX } from "../constants/routes";
import { Button, Col, Row } from "react-bootstrap";
import filterAlgorithms from "../utils/filterAlgorithms";
function CustomPostButton({ items, onClick }) {
  const renderItem = (item) => {
    const { id, blog_url, icon, name, short_description } = item;
    /*
     blog_url: "Backpropagation"
    description: "Backpropagation, short for "back"
    icon: "/icons/Algorithms/Backprop.png"
    id: "e40a2b1920a64d3881dc9f72f623e444"
    name: "Backpropagation"
    short_description: "Backpropagation optimizes n"



      <Card>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
          <Card.Text>{short_description}</Card.Text>
            <div>
            </div>
      </Card.Body>
      </Card>
            */
    return (
      <div
        key={id}
        className="ccab-div border-0 my-shadow-light rounded-4 overflow-hidden hover my-3 mx-2 p-3 d-flex flex-column"
      >
        <div className="ccab-subdiv d-flex flex-column align-items-center">
          <img className="calgo-btn-img mb-2" alt="blog" src={icon} />
          <h5 className="align-self-start">{name}</h5>
          <p className="short-desc">{short_description}</p>
        </div>
        <div className="ccab-subdiv">
          <Button
            onClick={() => onClick(item)}
            className="mb-3"
            variant="primary"
            size="lg"
          >
            Choose for training
          </Button>
          <Link to={BLOG_URL_PREFIX + blog_url}>
            <div className="cpb-link d-flex flex-row justify-content-center align-items-center">
              <p className="learn-more ml-2">Learn More</p>
              <img src={"./icons/link.svg"} height={16} width={16} alt="link" />
            </div>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Row className="custom-choose-algo-btn d-flex justify-content-center">
      {filterAlgorithms(items).map((el, i) => (
        <Col key={"ccal-" + i} xxl={3} xl={4} lg={5} md={6}>
          {renderItem(el)}
        </Col>
      ))}
    </Row>
  );
}

export default CustomPostButton;
