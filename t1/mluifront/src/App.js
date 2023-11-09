import {
  // Switch,
  Route,
  BrowserRouter as Router,
  Routes,
  // Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import FAQPage from "./pages/FAQPage";
import NewModelPage from "./pages/NewModelPage";
import TrainListPage from "./pages/TrainListPage";
import LogoutPage from "./pages/LogoutPage";
import ResetPassPage from "./pages/ResetPassPage";
import ProfilePage from "./pages/ProfilePage";
import ConfirmResetPassPage from "./pages/ConfirmResetPassPage";
import ChangePassPage from "./pages/ChangePassPage";
import Container from "react-bootstrap/Container";
// import { createBrowserHistory } from "history";
// const history = createBrowserHistory();
import * as URLs from "./constants/routes";
import MyNavbar from "./components/MyNavbar";
import { connect } from "react-redux";

function App(props) {
  const { loggedin } = props;
  const private_routes = (
    <>
      <Route path={URLs.NEW_MODEL_URL} Component={NewModelPage} />
      <Route path={URLs.TRAIN_LIST_URL} Component={TrainListPage} />
      <Route path={URLs.PROFILE_URL} exact Component={ProfilePage} />
      <Route path={URLs.CHANGE_PASS_URL} exact Component={ChangePassPage} />
    </>
  );
  const public_routes = (
    <>
      <Route path={URLs.RESET_PASS_URL} exact Component={ResetPassPage} />
    </>
  );
  const free4all_routes = (
    <>
      <Route index path={URLs.DASHBOARD_URL} exact Component={DashboardPage} />
      <Route path={URLs.FAQ_URL} exact Component={FAQPage} />
      <Route path={URLs.LOGOUT_URL} exact Component={LogoutPage} />
      <Route path={URLs.LOGIN_URL} exact Component={LoginPage} />
      <Route path={URLs.REGISTER_URL} exact Component={RegisterPage} />
      <Route
        path={URLs.CONFIRM_RESET_PASS_URL}
        Component={ConfirmResetPassPage}
      />
      <Route path="*" Component={NotFoundPage} />
    </>
  );
  return (
    <Router>
      <MyNavbar />
      <Container className="app-container">
        <Routes>
          {/* <Switch> */}
          {loggedin ? private_routes : public_routes}
          {free4all_routes}
          {/* </Switch> */}
        </Routes>
      </Container>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  loggedin: state.auth.loggedin,
});
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
