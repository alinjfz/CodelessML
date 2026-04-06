import React, { useEffect } from "react";
import { Row, Col, Breadcrumb, Button } from "react-bootstrap";
import UploadSection from "../components/UploadSection";
import ChooseFeatureSection from "../components/ChooseFeatureSection";
import CustomizeTrainSection from "../components/CustomizeTrainSection";
import ResultSection from "../components/ResultSection";

import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as TrainActions from "../actions/train";
import { Navigate } from "react-router-dom";
import { LOGIN_URL } from "../constants/routes";

function NewModelPage({ new_model, trainActions, loggedin }) {
  // const [progress, setProgress] = useState(0)
  const progress = 0 || new_model.progress;
  useEffect(() => {
    if (
      // new_model.progress !== 0 &&
      loggedin &&
      typeof trainActions.train_clear_new_model === "function"
    ) {
      trainActions.train_clear_new_model();
    }
    return () => {};
  }, []);
  if (!loggedin) return <Navigate to={LOGIN_URL} replace={true} />;

  const setProgress = () => {};
  const breadcrump_data = [
    {
      id: 0,
      text: "Upload Dataset",
      component: <UploadSection />,
      link: "",
    },
    {
      id: 1,
      text: "Choose Features",
      component: <ChooseFeatureSection />,
      link: "",
    },
    {
      id: 2,
      text: "Customize Training",
      component: <CustomizeTrainSection />,
      link: "",
    },
    {
      id: 3,
      text: "Result",
      component: <ResultSection />,
      link: "",
    },
  ];
  const isNavigationDisabled = (i) => {
    //true means disabled
    const progress = 0 || new_model.progress;
    const after = progress + i;
    //we have 0,1,2,3
    if (after < 0 || after > 3) {
      return true;
    }
    if (!new_model || !new_model.dataset_id) {
      return true;
    }
    if (
      after > 0 &&
      (!new_model.target_column ||
        !new_model.feature_columns ||
        new_model.feature_columns.length === 0)
    )
      return true;

    if (
      after === 2 &&
      new_model.target_column &&
      new_model.feature_columns &&
      new_model.feature_columns.length > 0
    )
      return false;
    if (
      after > 2
      //  &&
      // (!new_model.suggested_algorithm ||
      //   !new_model.suggested_algorithm.length === 0)
    )
      return true;
    return false;
  };
  const handleNavigation = (i) => {
    const progress = 0 || new_model.progress;
    const after = progress + i;
    if (typeof trainActions.train_set_new_model === "function")
      trainActions.train_set_new_model({ progress: after });
  };
  const breadcrumb_component = (
    <Row className="d-flex flex-row justify-content-center">
      <Col lg={6}>
        <Breadcrumb className="new-model-page-breadcrumb">
          {breadcrump_data.map((el, i) => (
            <Breadcrumb.Item
              active={el.id <= progress ? false : true}
              onClick={() => setProgress(el.id)}
              key={"breadcrumb-no-" + el.id}
              // active={el.id === progress}
            >
              {el.text}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </Col>
    </Row>
  );
  let section =
    null || (breadcrump_data[progress] && breadcrump_data[progress].component);
  const navigationSection = (
    <Row className="d-flex flex-row justify-content-center">
      <Col xxl={5} xl={6} lg={7}>
        <div className="d-flex justify-content-between my-2">
          <Button
            onClick={() => handleNavigation(-1)}
            disabled={isNavigationDisabled(-1)}
            variant="primary"
          >
            Prev Step
          </Button>
          <Button
            onClick={() => handleNavigation(1)}
            disabled={isNavigationDisabled(1)}
            variant="primary"
          >
            Next Step
          </Button>
        </div>
      </Col>
    </Row>
  );
  return (
    <>
      {breadcrumb_component}
      {navigationSection}
      {section}
    </>
  );
}

const mapStateToProps = (state) => ({
  new_model: state.train && state.train.new_model,
  loggedin: state.auth.loggedin,
});

const mapDispatchToProps = (dispatch) => {
  return {
    trainActions: bindActionCreators(TrainActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewModelPage);
