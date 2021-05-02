import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";

class deviceStatusView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device_id: "",
      pageTransition: "deviceViewPage",
      file_type: "",
      battery_level: "",
      last_bootup_timestamp: "",
      telemetry_service_status: "",
      motion_sensing_service_status: "",
      environment_sensing_service_status: "",
      location_sensing_service_status: "",
      heart_beat_service_status: "",
      last_error_msg: "",
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",
    };
  }

  switchToStatusViewPage = () => {
    const data = {
      operation: "status",
      device_id: this.state.device_id,
    };
    axios
      .get(this.props.server_address + "/uptime/sense/device/config", {
        params: data,
      })
      .then((response) => {
        if (response.data["status"] === "success") {
          this.setState({
            device_id: response.data["device_id"],
            file_type: response.data["file_type"],
            battery_level: response.data["battery_level"],
            last_bootup_timestamp: response.data["last_bootup_timestamp"],
            telemetry_service_status: response.data["telemetry_service_status"],
            motion_sensing_service_status:
              response.data["motion_sensing_service_status"],
            environment_sensing_service_status:
              response.data["environment_sensing_service_status"],
            location_sensing_service_status:
              response.data["location_sensing_service_status"],
            heart_beat_service_status:
              response.data["heart_beat_service_status"],
            last_error_msg: response.data["last_error_msg"],
            pageTransition: "statusViewPage",
          });
        } else {
          this.setState({
            device_id: "",
            file_type: "",
            battery_level: "",
            last_bootup_timestamp: "",
            telemetry_service_status: "",
            motion_sensing_service_status: "",
            environment_sensing_service_status: "",
            location_sensing_service_status: "",
            heart_beat_service_status: "",
            last_error_msg: "",
          });
          this.flashAlert("Device not found", "danger");
        }
      })
      .catch((response) => {
        this.flashAlert("Failed fetch data from web server", "danger");
      });
  };

  centralEventHandler = (event) => {
    switch (event.target.name) {
      case "deviceViewBackButtonClickHandler":
        this.props.history.push({
          pathname: "/uptime/home/",
        });
        break;
      case "statusViewBackButtonClickHandler":
        this.setState({
          pageTransition: "deviceViewPage",
        });
        break;
      case "statusViewRefreshButtonClickHandler":
        this.switchToStatusViewPage();
        break;
      case "nextButtonClickHandler":
        this.switchToStatusViewPage();
        break;
      case "deviceIDChangeHandler":
        this.setState({
          device_id: event.target.value,
        });
        break;
    }
  };

  flashAlert = (message, message_variant) => {
    this.setState({
      showflashMessage: true,
      flashMessage: message,
      flashVariant: message_variant,
    });

    setTimeout(() => {
      this.setState({
        showflashMessage: false,
        flashMessage: "",
        flashVariant: "info",
      });
    }, 3000);
  };

  statusViewPanelContent = () => {
    return (
      <div>
        <Row>
          <Col sm="4">
            <Form.Label>Device ID</Form.Label>
          </Col>
          <Col sm="4">
            <Form.Label>{this.state.device_id}</Form.Label>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="4">
            <Form.Label>Battery Level</Form.Label>
          </Col>
          <Col sm="4">
            <Form.Label>{this.state.battery_level}%</Form.Label>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="4">
            <Form.Label>Last Boot-up time</Form.Label>
          </Col>
          <Col sm="4">
            <Form.Label>{this.state.last_bootup_timestamp}</Form.Label>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="4">
            <Form.Label>Telemetry service</Form.Label>
          </Col>
          <Col sm="4">
            <Form.Label>{this.state.telemetry_service_status}</Form.Label>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="4">
            <Form.Label>Motion sensing service</Form.Label>
          </Col>
          <Col sm="4">
            <Form.Label>{this.state.motion_sensing_service_status}</Form.Label>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="4">
            <Form.Label>Environment sensing service</Form.Label>
          </Col>
          <Col sm="4">
            <Form.Label>
              {this.state.environment_sensing_service_status}
            </Form.Label>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="4">
            <Form.Label>Location sensing service</Form.Label>
          </Col>
          <Col sm="4">
            <Form.Label>
              {this.state.location_sensing_service_status}
            </Form.Label>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="8">
            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="statusViewBackButtonClickHandler"
              onClick={this.centralEventHandler}
            >
              Back
            </Button>

            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="statusViewRefreshButtonClickHandler"
              onClick={this.centralEventHandler}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  deviceViewPanelContent = () => {
    return (
      <div>
        <Row>
          <Col sm="8">
            <Form.Label>Device ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Device ID"
              name="deviceIDChangeHandler"
              onChange={this.centralEventHandler}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm="4">
            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="deviceViewBackButtonClickHandler"
              onClick={this.centralEventHandler}
            >
              Back
            </Button>

            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="nextButtonClickHandler"
              onClick={this.centralEventHandler}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
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
    if (this.state.pageTransition === "statusViewPage") {
      return (
        <div>
          {this.navbarInterface("Device Status")}
          <Container>
            {this.panelInterface("", this.statusViewPanelContent())}
          </Container>
          <Alert
            style={{ width: "500px", transitions: "fade" }}
            key={1}
            variant={this.state.flashVariant}
            show={this.state.showflashMessage}
            dismissible={true}
          >
            {this.state.flashMessage}
          </Alert>
        </div>
      );
    } else {
      return (
        <div>
          {this.navbarInterface("Device Status")}
          <Container>
            {this.panelInterface("", this.deviceViewPanelContent())}
          </Container>
          <Alert
            style={{ width: "500px", transitions: "fade" }}
            key={1}
            variant={this.state.flashVariant}
            show={this.state.showflashMessage}
            dismissible={true}
          >
            {this.state.flashMessage}
          </Alert>
        </div>
      );
    }
  }
}

// ========= redux ============
const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
    server_address: state.server_address,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userIDUpdate: (id) => dispatch({ type: "USER_ID", payload: id }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(deviceStatusView);
