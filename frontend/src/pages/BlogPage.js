import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CustomPostButton from "../components/CustomPostButton";
import BlogItem from "../components/BlogItem";
import all_posts from "../utils/AllPosts";

export default function BlogPage(props) {
  //blog, title, blog_id, related_posts
  let { blog_url = "" } = useParams();
  let location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (blog_url !== "") return <BlogItem />;

  return (
    <>
      <Row className="mx-3 mt-4">
        <h2>Posts:</h2>
      </Row>
      <Row className="mt-3">
        {all_posts.map((el) => (
          <Col key={"post-" + el.blog_id} md={6} className="mt-3">
            <CustomPostButton
              id={el.pic}
              alt={"post"}
              blog_url={el.blog_url}
              name={el.blog_title}
              icon={el.pic}
            />
          </Col>
        ))}
      </Row>
    </>
  );
}
