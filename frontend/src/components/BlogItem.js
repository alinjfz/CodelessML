import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BLOG_URL_PREFIX } from "../constants/routes";
import { useLocation } from "react-router-dom";
import all_posts from "../utils/AllPosts";

export default function BlogPage(props) {
  //blog, title, blog_id, related_posts
  let { blog_url = "" } = useParams();
  let location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!blog_url) return null;
  const blog = all_posts.find((el) => el.blog_url === blog_url);
  if (!blog || !blog.blog_id) return null;
  return (
    <>
      <Row className="g-5">
        <Col sm={12} md={12} lg={8} xl={8} xxl={7}>
          <article className="blog-post">
            <h1 className="blog-post-title">{blog.title}</h1>
            <hr />
            {blog.blog}
          </article>
        </Col>
        <Col className="d-none d-xxl-block" xxl={1}></Col>
        <Col sm={12} md={12} lg={4} xl={4} xxl={4}>
          <div className="position-sticky" style={{ top: "2rem" }}>
            <div className="p-4 mb-3 bg-light rounded">
              <h4 className="fst-italic">Why algorithm is important</h4>
              <p className="mb-0">
                Choosing the right machine learning algorithm is crucial for
                accurate and efficient model training. The selection impacts
                accuracy, computational efficiency, and adaptability to data
                characteristics. Factors such as interpretability, scalability,
                and robustness to noise influence the algorithm choice, ensuring
                tailored solutions for diverse applications in artificial
                intelligence and machine learning.
              </p>
            </div>

            <div className="p-4">
              <Link to={BLOG_URL_PREFIX}>
                <h4 className="fst-italic">Other Posts</h4>
              </Link>
              <ol className="list-unstyled mb-0">
                {all_posts.map((item) =>
                  item.blog_id !== blog.blog_id ? (
                    <li key={"blog-" + item.blog_id}>
                      <Link to={BLOG_URL_PREFIX + item.blog_url}>
                        {item.title}
                      </Link>
                    </li>
                  ) : null
                )}
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
