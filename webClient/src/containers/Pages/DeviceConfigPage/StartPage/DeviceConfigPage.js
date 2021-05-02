import React, { Component } from "react";
import "./DeviceConfigPage.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import addImage from "../../../../assets/addNew.png";
import removeImage from "../../../../assets/remove.png";
import updateImage from "../../../../assets/deviceSettings.png";
import programImage from "../../../../assets/flashDevice.png";
import Alert from "react-bootstrap/Alert";

class deviceConfigPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",

      selectedParamter: "System",
      panel_deviceid: "",
      currentPanelContent: "",
    };
  }

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
    }, 2000);
  };


  onSaveAlertCloseHandler = (event) => {
    this.setState({
      showflashMessage: false,
    });
  };

  //============== Buttons =================
  addButtonClickHandler = () => {
    if (this.state.panel_deviceid !== null) {
      const data = {
        operation: "add",
        device_id: this.state.panel_deviceid,
      };
      axios.post(
        this.props.server_address + "/uptime/sense/device/config",
        data
      ).then((response) => {
        if (response.data["status"] === "success") {
          this.flashAlert("OK", "info")
        } else {
          this.flashAlert("Failed", "danger")
        }
      }).catch((response) => {
        this.props.history.push({
          pathname: "/uptime/error",
        });
      })
    }
  };

  removeButtonClickHandler = () => {
    if (this.state.panel_deviceid !== null) {
      const data = {
        operation: "remove",
        device_id: this.state.panel_deviceid,
      };
      axios.post(
        this.props.server_address + "/uptime/sense/device/config",
        data
      ).then((response) => {
        if (response.data["status"] === "success") {
          this.flashAlert("Device Removed Successfully", "info")
        } else {
          this.flashAlert(response.data["reason"], "danger")
        }
      }).catch((response) => {
        this.props.history.push({
          pathname: "/uptime/error",
        });
      })
    }
  };

  flashButtonHandler = (event) => {

    if (this.state.panel_deviceid !== null) {
      let post_data = {
        id: this.props.user_id,
        device_id: this.state.panel_deviceid,
        operation: "programmer",
        uploadParam: "configuration",
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
    }
  };

  updateButtonClickHandler = () => {
    if (this.state.panel_deviceid == "") {
      this.flashAlert("Please entry Device ID and Configuration Category", "danger")
    } else {
      const data = {
        operation: "validate_device",
        device_id: this.state.panel_deviceid,
      };
      axios.post(
        this.props.server_address + "/uptime/sense/device/config",
        data
      ).then((response) => {
        if (response.data["status"] === "success") {
          switch (this.state.selectedParamter) {
            case "System":
              this.props.history.push({
                pathname: "/uptime/sense/device/config/system",
                state: { deviceid: this.state.panel_deviceid },
              });
              break;
            case "Protocol":
              this.props.history.push({
                pathname: "/uptime/sense/device/config/protocol",
                state: { deviceid: this.state.panel_deviceid },
              });
              break;
            case "Storage":
              this.props.history.push({
                pathname: "/uptime/sense/device/config/storage",
                state: { deviceid: this.state.panel_deviceid },
              });
              break;
            case "Sensing":
              this.props.history.push({
                pathname: "/uptime/sense/device/config/sensing",
                state: { deviceid: this.state.panel_deviceid },
              });
              break;
          }
        } else {
          this.flashAlert(response.data["reason"], "danger")
        }
      }).catch((response) => {
        this.props.history.push({
          pathname: "/uptime/error",
        });
      })
    }
  };

  backButtonClickHandler = () => {
    this.props.history.push({
      pathname: "/uptime/home",
    });
  };

  // ==========  Selects  ==================
  deviceIDChange = (event) => {
    this.setState({
      panel_deviceid: event.target.value,
    });
  };

  parameterSelectEventHandle = (event) => {
    switch (event.target.value) {
      case "System":
        this.setState({
          selectedParamter: "System",
        });
        break;
      case "Protocol":
        this.setState({
          selectedParamter: "Protocol",
        });
        break;
      case "Storage":
        this.setState({
          selectedParamter: "Storage",
        });
        break;
      case "Sensing":
        this.setState({
          selectedParamter: "Sensing",
        });
        break;
    }
  };

  // ======== Central event handler ===============
  centralEventHandler = (option, event) => {
    switch (option) {
      case "add_button":
        this.addButtonClickHandler();
        break;
      case "flash_button":
        this.flashButtonHandler();
        break;
      case "remove_button":
        this.removeButtonClickHandler();
        break;
      case "update_button":
        this.updateButtonClickHandler();
        break;
      case "back_button":
        this.backButtonClickHandler();
        break;
      case "device_id":
        this.deviceIDChange(event);
        break;
      case "config_param":
        this.parameterSelectEventHandle(event);
        break;
      case "iconClickHandler":
        this.iconClickHandler(event);
        break;
    }
  };
  // =========== Panels ================
  iconClickHandler = (event) => {
    this.setState({
      currentPanelContent: event.target.name,
    });
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

  updatePanelContent = () => {
    const configParameterOption = ["System", "Protocol", "Storage", "Sensing"];
    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="5">
          <Row>
            <Col sm="8">
              <Form.Label style={{ fontSize: "20px" }}>Update Device Configuration</Form.Label>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="8">
              <label>Device ID</label>
              <Form.Control
                type="text"
                placeholder="Enter Device ID"
                // name="inspectpanel_deviceid"
                name="panel_deviceid"
                onChange={(e) => {
                  this.centralEventHandler("device_id", e);
                }}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="8">
              <Form.Label>Configuration Category</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  this.centralEventHandler("config_param", e);
                }}
              >
                {configParameterOption.map((item, index) => {
                  return <option>{item}</option>;
                })}
              </Form.Control>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="4">
              <Button
                style={{ width: "100px", backgroundColor: "#2997c2" }}
                className="Button"
                onClick={(e) => {
                  this.centralEventHandler("back_button", e);
                }}
              >
                Back
              </Button>
            </Col>
            <Col sm="4">
              <Button
                style={{ width: "100px", backgroundColor: "#2997c2" }}
                className="Button"
                onClick={(e) => {
                  this.centralEventHandler("update_button", e);
                }}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  addPanelContent = () => {
    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="5">
          <Row>
            <Col sm="8">
              <Form.Label style={{ fontSize: "20px" }}>Add Device</Form.Label>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="8">
              <label>Device ID</label>
              <Form.Control
                type="text"
                placeholder="Enter Device ID"
                name="addRemovepanel_deviceid"
                onChange={(e) => {
                  this.centralEventHandler("device_id", e);
                }}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="4">
              <Button
                style={{
                  width: "100px",
                  backgroundColor: "#2997c2",
                }}
                onClick={(e) => {
                  this.centralEventHandler("add_button", e);
                }}
              >
                Add
            </Button>
            </Col>
          </Row>
        </Col>
      </Row>)
  };

  programmerPanelContent = () => {

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="5">
          <Row>
            <Col sm="8">
              <Form.Label style={{ fontSize: "20px" }}>Flash Device Configuration</Form.Label>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="8">
              <label>Device ID</label>
              <Form.Control
                type="text"
                placeholder="Enter Device ID"
                name="addRemovepanel_deviceid"
                onChange={(e) => {
                  this.centralEventHandler("device_id", e);
                }}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="4">
              <Button
                style={{
                  width: "100px",
                  backgroundColor: "#2997c2",
                }}
                onClick={(e) => {
                  this.centralEventHandler("flash_button", e);
                }}
              >
                Flash
            </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  };

  removePanelContent = () => {

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="5">
          <Row>
            <Col sm="8">
              <Form.Label style={{ fontSize: "20px" }}>Remove Device</Form.Label>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="8">
              <label>Device ID</label>
              <Form.Control
                type="text"
                placeholder="Enter Device ID"
                name="addRemovepanel_deviceid"
                onChange={(e) => {
                  this.centralEventHandler("device_id", e);
                }}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="4">
              <Button
                style={{
                  width: "100px",
                  backgroundColor: "#2997c2",
                }}
                onClick={(e) => {
                  this.centralEventHandler("remove_button", e);
                }}
              >
                Remove
            </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  };

  alertMessage = () => (
    <Alert
      style={{ width: "450px" }}
      key={1}
      variant={this.state.flashVariant}
      show={this.state.showflashMessage}
      onClose={(event) =>
        this.centralEventHandler("onSaveAlertCloseHandler")
      }
      dismissible={false}
    >
      <div>{this.state.flashMessage}</div>
    </Alert>
  )

  iconDisplayPanelContent = () => {
    let addImageSize = 60;
    let addImageBorder = "#ffffff";

    let removeImageSize = 60;
    let removeImageBorder = "#ffffff";

    let updateImageSize = 60;
    let updateImageBorder = "#ffffff";

    let programImageSize = 60;
    let programImageBorder = "#ffffff";

    switch (this.state.currentPanelContent) {
      case "add":
        addImageSize = 80;
        addImageBorder = "solid 3px #373a3b";
        break;
      case "remove":
        removeImageSize = 80;
        removeImageBorder = "solid 3px #373a3b";
        break;
      case "update":
        updateImageSize = 80;
        updateImageBorder = "solid 3px #373a3b";
        break;
      case "program":
        programImageSize = 80;
        programImageBorder = "solid 3px #373a3b";
        break;
    }

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3">
          <img
            src={addImage}
            height={addImageSize}
            width={addImageSize}
            style={{ border: addImageBorder }}
            name="add"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>
        <Col sm="3">
          <img
            src={updateImage}
            height={updateImageSize}
            width={updateImageSize}
            style={{ border: updateImageBorder }}
            name="update"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>
        <Col sm="3">
          <img
            src={programImage}
            height={programImageSize}
            width={programImageSize}
            style={{ border: programImageBorder }}
            name="program"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>
        <Col sm="3">
          <img
            src={removeImage}
            height={removeImageSize}
            width={removeImageSize}
            style={{ border: removeImageBorder }}
            name="remove"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>
      </Row>
    );
  };





  pageViewPanelContent = () => {
    if (this.state.currentPanelContent === "add") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.addPanelContent()}
          <br />
          <br />
          <br />
          {this.alertMessage()}
        </div>
      );
    } else if (this.state.currentPanelContent === "remove") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.removePanelContent()}
          <br />
          <br />
          <br />
          {this.alertMessage()}
        </div>
      );
    } else if (this.state.currentPanelContent === "update") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.updatePanelContent()}
          <br />
          <br />
          <br />
          {this.alertMessage()}
        </div>
      );
    } else if (this.state.currentPanelContent === "program") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.programmerPanelContent()}
          <br />
          <br />
          <br />
          {this.alertMessage()}
        </div>
      );
    } else {
      return <div>{this.iconDisplayPanelContent()}</div>;
    }
  };
  // ========= Render ============
  render() {
    return (
      <div>
        {this.navbarInterface("Device Lobby")}
        <Container>
          {this.panelInterface("", this.pageViewPanelContent())}
        </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(deviceConfigPage);
