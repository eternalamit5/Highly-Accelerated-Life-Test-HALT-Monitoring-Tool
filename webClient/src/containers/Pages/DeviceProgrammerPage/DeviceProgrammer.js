import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import programImage from "../../../assets/deviceProgram.png";

class deviceProgrammer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceID: "",
      uploadParamSelection: "configuration",
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",
    };
  }

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

  changeHandler = (event) => {
    switch (event.target.name) {
      case "deviceID":
        this.setState({
          deviceID: event.target.value,
        });
        break;

      case "uploadParam":
        this.setState({
          uploadParamSelection: event.target.value,
        });
        break;
    }
  };

  buttonHandler = (event) => {
    switch (event.target.name) {
      case "uploadButton":
        let post_data = {
          id: this.props.user_id,
          device_id: this.state.deviceID,
          operation: "programmer",
          uploadParam: this.state.uploadParamSelection,
        };

        axios
          .post(
            this.props.server_address + "/uptime/sense/device/programmer",
            post_data
          )
          .then((response) => {
            if (response.data["status"] === "success") {
              this.flashAlert("Successfully uploaded to the device", "info");
            } else {
              this.flashAlert("Failed to upload", "danger");
            }
          })
          .catch((response) => {
            this.flashAlert("Failed to reach web server", "danger");
          });
        break;
      case "backButton":
        this.props.history.push({
          pathname: "/uptime/home",
        });
        break;
    }
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "changeHandler":
        this.changeHandler(event);
        break;
      case "buttonHandler":
        this.buttonHandler(event);
        break;
    }
  };

  programmerPanelContent = () => {
    let configParameterOption = ["configuration"];
    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="4">
          <Row>
            <Col sm="8">
              <label>Device ID</label>
              <Form.Control
                type="text"
                placeholder="Enter Device ID"
                name="deviceID"
                onChange={(e) => {
                  this.centralEventHandler("changeHandler", e);
                }}
              />
            </Col>
          </Row>
          {/* <br />
          <Row>
            <Col sm="8">
              <Form.Label>Upload Parameter</Form.Label>
              <Form.Control
                as="select"
                name="uploadParam"
                onChange={(e) => {
                  this.centralEventHandler("changeHandler", e);
                }}
              >
                {configParameterOption.map((item, index) => {
                  return <option>{item}</option>;
                })}
              </Form.Control>
            </Col>
          </Row> */}
          <br />
          <Row>
            <Col sm="3">
              <Button
                style={{
                  width: "100px",
                  backgroundColor: "#2997c2",
                }}
                name="backButton"
                onClick={(e) => {
                  this.centralEventHandler("buttonHandler", e);
                }}
              >
                Back
              </Button>
            </Col>
            <Col sm="3">
              <Button
                style={{
                  width: "100px",
                  backgroundColor: "#2997c2",
                }}
                name="uploadButton"
                onClick={(e) => {
                  this.centralEventHandler("buttonHandler", e);
                }}
              >
                Upload
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <div>
        {this.navbarInterface("Device Programmer")}
        <Container>
          {this.panelInterface("", this.programmerPanelContent())}
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

export default connect(mapStateToProps, mapDispatchToProps)(deviceProgrammer);
