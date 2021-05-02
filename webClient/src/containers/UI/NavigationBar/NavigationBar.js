import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";
import NavDropdown from "react-bootstrap/NavDropdown";
import { propTypes } from "react-bootstrap/esm/Image";
import { connect } from "react-redux";

const Styles = styled.div`
  .navbar {
    background-color: #3facd6;
  }

  a,
  .navbar-nav .nav-dropdown {
    color: #222;
    &:hover {
      color: #21bce2;
    }
  }
  .navbar-brand,
  .navbar-nav .nav-link {
    color: #ffffff;

    &:hover {
      color: #808080;
    }
  }
`;

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  uptimeContents = () => {
    if (this.props.userid === null) {
      return (
        <Styles>
          <Navbar expand="lg">
            <Navbar.Brand>
              <Nav.Link
                as={Link}
                style={{ color: "#ffffff" }}
                to="/uptime/home"
              >
                UPTIME
              </Nav.Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/about">
                    About
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/register">
                    Register
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/login">
                    Login
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Styles>
      );
    } else {
      return (
        <Styles>
          <Navbar>
            <Navbar.Brand>
              <Nav.Link
                as={Link}
                style={{ color: "#ffffff" }}
                to="/uptime/home"
              >
                UPTIME
              </Nav.Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to={"/uptime/user/account"}
                >
                  User-Account
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/uptime/user/help"}>
                  Help
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  onClick={this.props.logout}
                  to={"/uptime/home"}
                >
                  Log-Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/uptime/home">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/uptime/about">
                  About Us
                </Nav.Link>
                <Nav.Link as={Link} to="/uptime/sense/device/config">
                  Device Lobby
                </Nav.Link>
                {/* <NavDropdown title="Scanner" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/scan/qrcode">
                    QR Scanner
                  </NavDropdown.Item>
                </NavDropdown> */}
                {/* <NavDropdown title="Database" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/dbmanager"
                  >
                    DB Manager
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/querymanager"
                  >
                    Query Manager
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/database/dashboardmanager"
                  >
                    Dashboard Manager
                  </NavDropdown.Item>
                </NavDropdown> */}
                {/* <NavDropdown title="Device" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/sense/device/config">
                    Configuration
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/uptime/sense/device/status">
                    Status Monitor
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/programmer"
                  >
                    Programmer
                  </NavDropdown.Item>
                </NavDropdown> */}
                {/* {<NavDropdown title="Analyse" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/analyse/frequencydomain"
                  >
                    Frequency Domain Analysis
                  </NavDropdown.Item>
                </NavDropdown>} */}
                {/* <NavDropdown title="Predict" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/predict/prediction">
                    Prediction
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/uptime/predict/config">
                    Configuration
                  </NavDropdown.Item>
                </NavDropdown> */}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Styles>
      );
    }
  }

  matildaContents = () => {
    if (this.props.userid === null) {
      return (
        <Styles>
          <Navbar expand="lg">
            <Navbar.Brand>
              <Nav.Link
                as={Link}
                style={{ color: "#ffffff" }}
                to="/uptime/home"
              >
                MATILDA
              </Nav.Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/about">
                    About
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/register">
                    Register
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/login">
                    Login
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Styles>
      );
    } else {
      return (
        <Styles>
          <Navbar>
            <Navbar.Brand>
              <Nav.Link
                as={Link}
                style={{ color: "#ffffff" }}
                to="/uptime/home"
              >
                MATILDA
              </Nav.Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to={"/uptime/user/notification/" + this.props.userid}
                >
                  Notifications
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to={"/uptime/user/account/" + this.props.userid}
                >
                  Account
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/uptime/help"}>
                  Help
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  onClick={this.props.logout}
                  to={"/uptime/home"}
                >
                  Log-Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/uptime/home">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/uptime/about">
                  About Us
                </Nav.Link>
                <NavDropdown title="Scanner" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/scan/qrcode">
                    QR Scanner
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Database" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/dbmanager"
                  >
                    DB Manager
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/querymanager"
                  >
                    Query Manager
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/database/dashboardmanager"
                  >
                    Dashboard Manager
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Device" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/sense/device/config">
                    Configuration
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/uptime/sense/device/status">
                    Status Monitor
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/programmer"
                  >
                    Programmer
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Analyse" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/analyse/frequencydomain"
                  >
                    Frequency Domain Analysis
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Predict" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/predict/prediction">
                    Prediction
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/uptime/predict/config">
                    Configuration
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Styles>
      );
    }
  }


  haltContents = () => {
    if (this.props.userid === null) {
      return (
        <Styles>
          <Navbar expand="lg">
            <Navbar.Brand>
              <Nav.Link
                as={Link}
                style={{ color: "#ffffff" }}
                to="/uptime/home"
              >
                HALT
              </Nav.Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/about">
                    About
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/register">
                    Register
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/uptime/login">
                    Login
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Styles>
      );
    } else {
      return (
        <Styles>
          <Navbar>
            <Navbar.Brand>
              <Nav.Link
                as={Link}
                style={{ color: "#ffffff" }}
                to="/uptime/home"
              >
                HALT
              </Nav.Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to={"/uptime/user/notification/" + this.props.userid}
                >
                  Notifications
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to={"/uptime/user/account/"}
                >
                  Account
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/uptime/help"}>
                  Help
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  onClick={this.props.logout}
                  to={"/uptime/home"}
                >
                  Log-Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/uptime/home">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/uptime/about">
                  About Us
                </Nav.Link>
                <NavDropdown title="Scanner" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/scan/qrcode">
                    QR Scanner
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Database" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/dbmanager"
                  >
                    DB Manager
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/querymanager"
                  >
                    Query Manager
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/database/dashboardmanager"
                  >
                    Dashboard Manager
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Device" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/sense/device/config">
                    Configuration
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/uptime/sense/device/status">
                    Status Monitor
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/device/programmer"
                  >
                    Programmer
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Analyse" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    to="/uptime/sense/analyse/frequencydomain"
                  >
                    Frequency Domain Analysis
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Predict" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/uptime/predict/prediction">
                    Prediction
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/uptime/predict/config">
                    Configuration
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Styles>
      );
    }
  }


  render() {
    if (this.props.app_name === "UPTIME") {
      return (
        <div>
          {this.uptimeContents()}
        </div>
      )
    } else if (this.props.app_name === "MATILDA") {
      return (
        <div>
          {this.matildaContents()}
        </div>
      )
    } else if (this.props.app_name === "HALT") {
      return (
        <div>
          {this.haltContents()}
        </div>
      )
    } else {
      return (
        <div>

        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    app_name: state.app_name,
    user_id: state.user_id,
    server_address: state.server_address,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userIDUpdate: (id) => dispatch({ type: "USER_ID", payload: id }),
    logout: () => dispatch({ type: "LOGOUT", payload: null }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
