import React from "react";
import { Button, Card, CardGroup, Col, Row } from "react-bootstrap";
import {
  BLOG_URL_PREFIX,
  NEW_MODEL_URL,
  PROFILE_URL,
  TRAIN_LIST_URL,
} from "../constants/routes";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import CustomHugeButton from "../components/CustomHugeButton";
import MainCarousel from "../components/MainCarousel";
import CustomPostButton from "../components/CustomPostButton";
import all_posts from "../utils/AllPosts";

function DashboardPage({ user_name, loggedin }) {
  const quick_actions = (
    <CardGroup>
      <CustomHugeButton
        description={"Understand and recommend information."}
        title={"New Model"}
        link_url={NEW_MODEL_URL}
      />
      <CustomHugeButton
        description={"Check previously trained models and predict with them."}
        title={"Trained Models"}
        link_url={TRAIN_LIST_URL}
      />
      <CustomHugeButton
        description={"Check and edit your profile."}
        title={"My Profile"}
        link_url={PROFILE_URL}
      />
    </CardGroup>
  );
  const blog_posts = all_posts.slice(0, 4);
  const posts = (
    <>
      <Row className="dash-post-header mt-5">
        <Link to={BLOG_URL_PREFIX}>
          <h4 className="text-center">Latest Posts</h4>
        </Link>
      </Row>
      {blog_posts.map((el) => (
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
    </>
  );
  const profile_snapshot = (
    <Card className="profile-snapshot border-0 rounded-0">
      <Row className="justify-content-md-center">
        <Col lg={6} className="p-5">
          <Card.Body>
            {user_name && loggedin ? <h4>Welcome, {user_name}</h4> : null}
            <h5>
              We're thrilled to have you on board. Here's what you can do:
            </h5>
            <p>
              Track the total number of models you've trained.
              <br />
              Explore detailed performance metrics for each trained model.
              <br />
              Create a new model with our user-friendly interface.
              <br />
              View a list of all your trained models and their details.
            </p>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );

  return (
    <>
      {profile_snapshot}
      <main className="container dashboard-page d-flex justify-content-center">
        <Row className="dashboard-main-row ">
          {/* <MainCarousel /> */}
          {quick_actions}
          {posts}
        </Row>
      </main>
    </>
  );
}

const mapStateToProps = (state) => ({
  loggedin: state.auth.loggedin,
  user_name: (state.auth && state.auth.user && state.auth.user.name) || "",
});

const mapDispatchToProps = (dispatch) => {
  return {
    trainActions: bindActionCreators(TrainActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
