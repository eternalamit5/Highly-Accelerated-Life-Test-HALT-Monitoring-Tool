import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import queryManagerPage from "../../Pages/DatabaseManagerPage/queryManagerPage";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import devStatusImage from "../../../assets/status.png";
import view3DImage from "../../../assets/view3D.png";
import logImage from "../../../assets/log.png";

class DeviceStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: null,
    };
  }

  iconClickHandler = (event) => {
    switch (event.target.name) {
      case "View 3D":
        this.props.history.push({
          pathname: "/uptime/sense/3Dview",
        });
        break;
      case "Event Logs":
        this.props.history.push({
          pathname: "/uptime/sense/eventlog",
        });
        break;
      case "devStatusView":
        this.props.history.push({
          pathname: "/uptime/sense/deviceStatusView",
        });
        break;
    }
  };

  iconDisplayPanelContent = () => {
    let dashboardImageSize = 80;
    let dashboardImageBorder = "#ffffff";

    let view3DImageSize = 80;
    let view3DImageBorder = "#ffffff";

    let logImageSize = 80;
    let logImageBorder = "#ffffff";

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="4">
          <img
            src={devStatusImage}
            height={dashboardImageSize}
            width={dashboardImageSize}
            style={{ border: dashboardImageBorder }}
            name="devStatusView"
            onClick={this.iconClickHandler}
          />
        </Col>

        <Col sm="4">
          <img
            src={view3DImage}
            height={view3DImageSize}
            width={view3DImageSize}
            style={{ border: view3DImageBorder }}
            name="View 3D"
            onClick={this.iconClickHandler}
          />
        </Col>

        <Col sm="4">
          <img
            src={logImage}
            height={logImageSize}
            width={logImageSize}
            style={{ border: logImageBorder }}
            name="Event Logs"
            onClick={this.iconClickHandler}
          />
        </Col>
      </Row>
    );
  };

  panelContent = () => {
    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        {this.iconDisplayPanelContent()}
      </Row>
    );
  };

  navbarInterface = (message) => {
    return (
      <div>
        <NavigationBar userid={this.props.user_id} />

        <Navbar bg="dark">
          <Navbar.Brand
            style={{
              color: "white",
            }}
            className="mx-auto"
          >
            <div style={{ fontSize: "20px" }}>{message}</div>
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  };

  panelInterface = (message, contents) => (
    <div>
      <Row>
        <Col sm="10">
          <Form.Label
            style={{
              fontSize: "20px",
            }}
          >
            {message}
          </Form.Label>
        </Col>
      </Row>
      <br />
      <Row>
        <Col sm="10">{contents}</Col>
      </Row>
    </div>
  );

  render() {
    return (
      <div>
        {this.navbarInterface("Device Status")}
        <Container>{this.panelInterface("", this.panelContent())}</Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
    server_address: state.server_address,
    influxdb_instance: state.influxdb_instance,
  };
};

export default connect(mapStateToProps)(DeviceStatus);
