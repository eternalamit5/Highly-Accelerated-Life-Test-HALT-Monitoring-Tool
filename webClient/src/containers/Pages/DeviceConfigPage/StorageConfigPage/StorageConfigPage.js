import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Form from "react-bootstrap/Form";
import "./StorageConfigPage.css";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import { connect } from "react-redux";

const SDcard_Peripheral_Comm_ParameterOption = [
  { hsspi: "High speed SPI" },
  { lsspi: "Low speed SPI" },
];

class StorageConfigPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onSaveAlert: false,
      sd_card_policy: {
        operation: "storage",
        device_id: this.props.location.state.deviceid,
        file_type: "storage",
        sdcard_en: false,
        sdcard_peripheral_comm_interface: "hsspi",
      },
    };
  }

  
  componentDidMount() {
    const data = {
      operation: "storage",
      device_id: this.state.sd_card_policy.device_id,
    };
    axios
      .get(this.props.server_address + "/uptime/sense/device/config", {
        params: data,
      })
      .then((response) => {
        // console.log(response.data);
        let temp = { ...this.state.sd_card_policy };

        (temp.device_id = response.data["device_id"]),
          (temp.file_type = response.data["file_type"]),
          (temp.sdcard_en = response.data["sdcard_en"]),
          (temp.sdcard_peripheral_comm_interface =
            response.data["sdcard_peripheral_comm_interface"]),
          this.setState({
            sd_card_policy: temp,
          });
      });
  }

  SD_card_Peripheral_Comm_SelectEventHandle = (event) => {
    let storage_config = { ...this.state.sd_card_policy };
    storage_config.sdcard_peripheral_comm_interface = event.target.value;
    this.setState({
      sd_card_policy: storage_config,
    });
  };

  handleSwitchButtonChange = (event) => {
    let storage_config = { ...this.state.sd_card_policy };
    storage_config.sdcard_en = !storage_config.sdcard_en;
    this.setState({
      sd_card_policy: storage_config,
    });
  };

  backButtonHandler = () => {
    this.props.history.push({
      pathname: "/uptime/sense/device/config/",
    });
  };

  saveButtonHandler = () => {
    this.setState({
      onSaveAlert: true,
    });
    setTimeout(this.onSaveAlertCloseHandler, 2000);
    let post_data = { ...this.state.sd_card_policy };
    axios
      .post(
        this.props.server_address + "/uptime/sense/device/config",
        post_data
      )
      .then((response) => {
        console.log(response.data);
        //todo Handle response.data["status"]
      });
  };

  onSaveAlertCloseHandler = () => {
    this.setState({
      onSaveAlert: false,
    });
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "SD_card_Peripheral_Comm_SelectEventHandle":
        this.SD_card_Peripheral_Comm_SelectEventHandle(event);
        break;
      case "handleSwitchButtonChange":
        this.handleSwitchButtonChange(event);
        break;

      case "saveButtonHandler":
        this.saveButtonHandler();
        break;
      case "backButtonHandler":
        this.backButtonHandler();
        break;

      case "onSaveAlertCloseHandler":
        this.onSaveAlertCloseHandler();
        break;
    }
  };

  StoragePanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="Enable SD Card Storage"
                  checked={this.state.sd_card_policy.sdcard_en}
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col sm="6">
            <Row>
              <Col sm="8">
                <Form.Label>Peripheral Communication Interface</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.centralEventHandler(
                      "SD_card_Peripheral_Comm_SelectEventHandle",
                      event
                    )
                  }
                  value={`${this.state.sd_card_policy.sdcard_peripheral_comm_interface}`}
                >
                  {SDcard_Peripheral_Comm_ParameterOption.map((item, index) => {
                    return (
                      <option value={`${Object.keys(item)}`}>
                        {Object.values(item)}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="5">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) =>
                this.centralEventHandler("backButtonHandler", event)
              }
            >
              Back
            </Button>
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) =>
                this.centralEventHandler("saveButtonHandler", event)
              }
            >
              Save
            </Button>
          </Col>
        </Row>
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant="info"
          show={this.state.onSaveAlert}
          onClose={this.onSaveAlertCloseHandler}
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  panelInterface = (message, contents) => (
    <div>
      <Row>
        <Col sm="8">
          <Form.Group controlId="panel">
            <Form.Label
              style={{
                marginLeft: "20px",
                fontSize: "20px",
              }}
            >
              {message}
            </Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm="10">
          <div className="FormGroup">
            <Form.Group controlId="contents">{contents}</Form.Group>
          </div>
        </Col>
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
              width: "50px",
            }}
            className="sr-auto"
          >
            <div style={{ fontSize: "14px" }}>
              Device UUID: {this.state.sd_card_policy.device_id}
            </div>
          </Navbar.Brand>
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
  //////////////////////////////////////////////////
  render() {
    return (
      <div>
        {this.navbarInterface("Storage Configuration")}
        <Container>
          {this.panelInterface("", this.StoragePanelContent())}
        </Container>
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(StorageConfigPage);
