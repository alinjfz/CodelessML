import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AuthActions from "../actions/auth";
import { Link, NavLink } from "react-router-dom";
import * as URLs from "../constants/routes";
import { NavDropdown } from "react-bootstrap";
import { useState } from "react";

function MyNavbar({ loggedin }) {
  const [dropdownActive, setDropdownActive] = useState(false);
  let nav_items = (
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
        <NavLink className="nav-link" to={URLs.FAQ_URL}>
          How it works
        </NavLink>
        {/* <NavLink className="nav-link" to={URLs.REGISTER_URL}>
          New Model
        </NavLink> */}
      </Nav>
      <Nav>
        <NavLink className="nav-link" to={URLs.LOGIN_URL}>
          Login / Register
        </NavLink>
      </Nav>
    </Navbar.Collapse>
  );
  if (loggedin) {
    nav_items = (
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <NavLink className="nav-link" to={URLs.FAQ_URL}>
            How it works
          </NavLink>
          <NavLink className="nav-link" to={URLs.TRAIN_LIST_URL}>
            Trained List
          </NavLink>
          <NavLink className="nav-link" to={URLs.NEW_MODEL_URL}>
            New Model
          </NavLink>
        </Nav>
        <Nav>
          <NavDropdown
            show={dropdownActive}
            onToggle={() => {
              const aff = !dropdownActive;
              setDropdownActive(aff);
            }}
            title="Account"
            id="nav-dropdown"
          >
            <Link
              className="dropdown-item"
              to={URLs.PROFILE_URL}
              onClick={() => setDropdownActive(false)}
            >
              Profile
            </Link>
            <Link
              className="dropdown-item"
              to={URLs.LOGOUT_URL}
              onClick={() => setDropdownActive(false)}
            >
              Log out
            </Link>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    );
  }
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      // bg="light"
      // data-bs-theme="dark"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand>
          <NavLink className="nav-link" to={URLs.DASHBOARD_URL}>
            <img
              src="/favicon.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logo"
            />
            AI Train
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {nav_items}
      </Container>
    </Navbar>
  );
}

const mapStateToProps = (state) => ({
  loggedin: state.auth.loggedin,
});
const mapDispatchToProps = (dispatch) => {
  return {
    Authactions: bindActionCreators(AuthActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyNavbar);
