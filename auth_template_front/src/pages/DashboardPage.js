import React from "react";
import { Button, Card, CardGroup, Col, Row } from "react-bootstrap";
import { PROFILE_URL } from "../constants/routes";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CustomHugeButton from "../components/CustomHugeButton";

function DashboardPage({ user_name, loggedin }) {
  const quick_actions = (
    <CardGroup>
      <CustomHugeButton
        description={"Check and edit your profile."}
        title={"My Profile"}
        link_url={PROFILE_URL}
      />
    </CardGroup>
  );
  const profile_snapshot = (
    <Card className="profile-snapshot border-0 rounded-0">
      <Row className="justify-content-md-center">
        <Col lg={6} className="p-5">
          <Card.Body>
            {user_name && loggedin ? <h4>Welcome, {user_name}</h4> : null}
            <h5>We're thrilled to have you on board.</h5>
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
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
