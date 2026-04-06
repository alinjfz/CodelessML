import Carousel from "react-bootstrap/Carousel";
import { NEW_MODEL_URL, TRAIN_LIST_URL } from "../constants/routes";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
function MainCarousel() {
  const carousel_data = [
    {
      id: 1,
      title: "Discover Your Models",
      content: "Explore the diversity of models you've trained.",
      link: TRAIN_LIST_URL,
      pic: "1.jpg",
    },
    {
      id: 2,
      title: "Data Magic",
      content: "Unveil the magic hidden within your datasets.",
      link: NEW_MODEL_URL,
      pic: "2.jpg",
    },
    {
      id: 3,
      title: "Uncover Patterns",
      content: "Dive into the patterns discovered by your models.",
      link: NEW_MODEL_URL,
      pic: "3.jpg",
    },
  ];
  const pic_prefix = "/pics/";
  return (
    <Carousel
      className="main-carousel"
      indicators={false}
      controls={false}
      variant="dark"
    >
      {carousel_data.map((item) => (
        <Carousel.Item key={"caro" + item.id} interval={4000}>
          <Image src={pic_prefix + item.pic} />
          <Carousel.Caption>
            {/* <Link to={item.link}> */}
            <h3>{item.title}</h3>
            {/* </Link> */}
            <p>{item.content}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MainCarousel;
