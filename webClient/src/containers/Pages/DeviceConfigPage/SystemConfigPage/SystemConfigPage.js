import React, { Component } from "react";
import PropTypes from "prop-types";
import Menu, { SubMenu, Item as MenuItem } from "rc-menu";
import "rc-menu/assets/index.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import "./SystemConfigPage.css";
import Navbar from "react-bootstrap/Navbar";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import axios from "axios";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

const children1 = [
  <MenuItem key="1-1" style={{ fontSize: "20px" }}>General</MenuItem>,

  <SubMenu style={{ fontSize: "20px" }}
    title={<span className="submenu-title-wrapper">Communication </span>}
    key="2"
  >
    <MenuItem key="2-1" style={{ fontSize: "16px" }}>UART</MenuItem>
    <MenuItem key="2-2" style={{ fontSize: "16px" }}>I2C/SPI</MenuItem>
    <MenuItem key="2-3" style={{ fontSize: "16px" }}>WiFi</MenuItem>
  </SubMenu>,
  <MenuItem key="2-4" style={{ fontSize: "20px" }}>Status Indication</MenuItem>,
  // <MenuItem key="3">Error Policy</MenuItem>,
  <MenuItem key="4" style={{ fontSize: "20px" }}>Error Policy</MenuItem>,
];

////////////////////Error policy///////////////////////////////
const ErrorConfigParameterOption = [
  { None: "None" },
  { Exception: "Exception" },
  { Major_Error: "Major_Error" },
  { Minor_Error: "Minor_Error" },
  { Major_Warning: "Major_Warning" },
  { Minor_Warning: "Minor_Warning" },
];

const ErrorDisplayConfigParameterOption = [
  "None",
  "Turn LED ON",
  "Turn LED OFF",
  "Toggle LED 1HZ",
  "Toggle LED 2HZ",
  "Toggle LED 4HZ",
  "Toggle LED RED",
  "Toggle LED BLUE",
  "Send Error Message Via MQTT",
  "Send Error Message Via TCP",
  "Send Error Message Via WS",
  "Send Error Message Via BLE",
  "Send Error Message Via UART0",
  "Send Error Message Via I2C0",
];

////////////////// Comm. Protocol/////////////////////////////////////

const BaudRateConfigParameterOption = [
  "2400",
  "4800",
  "9600",
  "19200",
  "38400",
  "57600",
  "115200",
  "128000",
  "256000",
];

const FreqencyConfigParameterOption = ["50KHz", "100KHz", "400KHz"];

const WiFiConfigParameterOption = [
  { 1: "wifi1" },
  { 2: "wifi2" },
  { 3: "wifi3" },
  { 4: "wifi4" },
  { 5: "wifi5" },
  { 6: "wifi6" },
  { 7: "wifi7" },
  { 8: "wifi8" },
  { 9: "wifi9" },
  { 10: "wifi10" },
];

const WiFiNetworkParameterOption = [
  "WiFi1",
  "WiFi2",
  "WiFi3",
  "WiFi4",
  "WiFi5",
  "WiFi6",
  "WiFi7",
  "WiFi8",
  "WiFi9",
  "WiFi10",
];
///////////////// class///////////////////////////////////////////

class systemConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: children1,
      overflowedIndicator: undefined,
      selectedItem: null,
      pageStatus: "main-menu",
      onSaveAlert: false,
      system_configuration: {
        operation: "system",
        device_id: this.props.location.state.deviceid,
        file_type: "system",
        device_type: "Gateway",
        network_id: "",
        device_description: "",

        // UART
        uart0_baud: "115200",
        uart1_baud: "115200",
        uart2_baud: "115200",
        uart0_en: false,
        uart1_en: false,
        uart2_en: false,

        //I2C
        i2c0_freq: "50000",
        i2c1_freq: "50000",
        i2c0_en: false,
        i2c1_en: false,
        //SPI
        hsspi_en: false, // switchHSSPI
        lsspi_en: false, // switchLSSPI
        wifi_en: true,
        wifi_smartconnect_en: false,
        wifi_reconnect_attempt: "5",

        wifi_ssid1: "",
        wifi_ssid2: "",
        wifi_ssid3: "",
        wifi_ssid4: "",
        wifi_ssid5: "",
        wifi_ssid6: "",
        wifi_ssid7: "",
        wifi_ssid8: "",
        wifi_ssid9: "",
        wifi_ssid10: "",

        wifi_password1: "",
        wifi_password2: "",
        wifi_password3: "",
        wifi_password4: "",
        wifi_password5: "",
        wifi_password6: "",
        wifi_password7: "",
        wifi_password8: "",
        wifi_password9: "",
        wifi_password10: "",

        appStatusIndicator_en: true, // Application Status Indicator
        std_exception: "None",
        error_major: "None",
        error_minor: "None",
        warn_major: "None",
        warn_minor: "None",
      },
    };
  }

  componentDidMount() {
    const data = {
      operation: "system",
      device_id: this.state.system_configuration.device_id,
    };
    axios
      .get(this.props.server_address + "/uptime/sense/device/config", {
        params: data,
      })
      .then((response) => {
        // console.log(response.data);
        let temp = { ...this.state.system_configuration };

        (temp.device_id = response.data["device_id"]),
          (temp.file_type = response.data["file_type"]),
          (temp.device_type = response.data["device_type"]),
          (temp.network_id = response.data["network_id"]),
          (temp.device_description = response.data["device_description"]),
          // UART
          (temp.uart0_baud = response.data["uart0_baud"]),
          (temp.uart1_baud = response.data["uart1_baud"]),
          (temp.uart2_baud = response.data["uart2_baud"]),
          (temp.uart0_en = response.data["uart0_en"]),
          (temp.uart1_en = response.data["uart1_en"]),
          (temp.uart2_en = response.data["uart2_en"]),
          //I2C
          (temp.i2c0_freq = response.data["i2c0_freq"]),
          (temp.i2c1_freq = response.data["i2c1_freq"]),
          (temp.i2c0_en = response.data["i2c0_en"]),
          (temp.i2c1_en = response.data["i2c1_en"]),
          //SPI
          (temp.hsspi_en = response.data["hsspi_en"]), // switchHSSPI
          (temp.lsspi_en = response.data["lsspi_en"]), // switchLSSPI
          (temp.wifi_en = response.data["wifi_en"]),
          (temp.wifi_smartconnect_en = response.data["wifi_smartconnect_en"]),
          (temp.wifi_reconnect_attempt =
            response.data["wifi_reconnect_attempt"]),
          (temp.wifi_ssid1 = response.data["wifi_ssid1"]),
          (temp.wifi_ssid2 = response.data["wifi_ssid2"]),
          (temp.wifi_ssid3 = response.data["wifi_ssid3"]),
          (temp.wifi_ssid6 = response.data["wifi_ssid6"]),
          (temp.wifi_ssid7 = response.data["wifi_ssid7"]),
          (temp.wifi_ssid8 = response.data["wifi_ssid8"]),
          (temp.wifi_ssid9 = response.data["wifi_ssid9"]),
          (temp.wifi_ssid10 = response.data["wifi_ssid10"]),
          (temp.wifi_password1 = response.data["wifi_password1"]),
          (temp.wifi_password2 = response.data["wifi_password2"]),
          (temp.wifi_password3 = response.data["wifi_password3"]),
          (temp.wifi_password4 = response.data["wifi_password4"]),
          (temp.wifi_password5 = response.data["wifi_password5"]),
          (temp.wifi_password6 = response.data["wifi_password6"]),
          (temp.wifi_password7 = response.data["wifi_password7"]),
          (temp.wifi_password8 = response.data["wifi_password8"]),
          (temp.wifi_password9 = response.data["wifi_password9"]),
          (temp.wifi_password10 = response.data["wifi_password10"]),
          (temp.appStatusIndicator_en = response.data["appStatusIndicator_en"]), // Application Status Indicator
          (temp.std_exception = response.data["std_exception"]),
          (temp.error_major = response.data["error_major"]),
          (temp.error_minor = response.data["error_minor"]),
          (temp.warn_major = response.data["warn_major"]),
          (temp.warn_minor = response.data["warn_minor"]),
          this.setState({
            system_configuration: temp,
          });
      });
  }

  handleSwitchButtonChange = (event) => {
    let sys_config = { ...this.state.system_configuration };
    switch (event.target.name) {
      case "UART0":
        sys_config.uart0_en = !sys_config.uart0_en;
        break;
      case "UART1":
        sys_config.uart1_en = !sys_config.uart1_en;
        break;
      case "UART2":
        sys_config.uart2_en = !sys_config.uart2_en;
        break;
      case "I2C0":
        sys_config.i2c0_en = !sys_config.i2c0_en;
        break;
      case "I2C1":
        sys_config.i2c1_en = !sys_config.i2c1_en;
        break;
      case "HSSPI":
        sys_config.hsspi_en = !sys_config.hsspi_en;
        break;
      case "LSSPI":
        sys_config.lsspi_en = !sys_config.lsspi_en;
        break;
      case "WIFI":
        sys_config.wifi_en = !sys_config.wifi_en;
        break;
      case "SMARTCONN":
        sys_config.wifi_smartconnect_en = !sys_config.wifi_smartconnect_en;
        break;
      case "STATUSIND":
        sys_config.appStatusIndicator_en = !sys_config.appStatusIndicator_en;
        break;
      default:
        break;
    }
    this.setState({
      system_configuration: sys_config,
    });
  };

  menuSelectHandler = (info) => {
    this.setState({
      selectedItem: info.key,
    });

    switch (info.key) {
      case "1-1":
        this.setState({
          pageStatus: "general",
        });
        break;
      case "2-1":
        this.setState({
          pageStatus: "UART",
        });
        break;
      case "2-2":
        this.setState({
          pageStatus: "I2C/SPI",
        });
        break;
      case "2-3":
        this.setState({
          pageStatus: "WIFI",
        });
        break;
      case "2-4":
        this.setState({
          pageStatus: "Status Indicator",
        });
        break;
      case "4":
        this.setState({
          pageStatus: "Error-Policy",
        });
        break;
    }
  };

  /////////////////////////////Input handler//////////////////////////////////
  NetworkIDEventHandle = (event) => {
    let sys_config = { ...this.state.system_configuration };
    sys_config.network_id = event.target.value;
    this.setState({
      system_configuration: sys_config,
    });
  };

  DeviceDescriptionEventHandle = (event) => {
    let sys_config = { ...this.state.system_configuration };
    sys_config.device_description = event.target.value;
    this.setState({
      system_configuration: sys_config,
    });
  };

  /////////////////////////////Button handler//////////////////////////////////

  saveButtonHandler = (event) => {
    this.setState({
      onSaveAlert: true,
    });
    setTimeout(this.onSaveAlertCloseHandler, 2000);

    let post_data = { ...this.state.system_configuration };
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

  backButtonHandler = (event) => {
    this.setState({
      pageStatus: "main-menu",
    });
  };

  removeButtonHandler = (event) => {
    let sys_config = { ...this.state.system_configuration };

    switch (event.target.name) {
      case "AP1":
        sys_config.wifi_ssid1 = "";
        sys_config.wifi_password1 = "";
        break;
      case "AP2":
        sys_config.wifi_ssid2 = "";
        sys_config.wifi_password2 = "";
        break;
      case "AP3":
        sys_config.wifi_ssid3 = "";
        sys_config.wifi_password3 = "";
        break;
      case "AP4":
        sys_config.wifi_ssid4 = "";
        sys_config.wifi_password4 = "";
        break;
      case "AP5":
        sys_config.wifi_ssid5 = "";
        sys_config.wifi_password5 = "";
        break;
      default:
        break;
    }

    this.setState({
      system_configuration: sys_config,
    });
  };

  menuBackButtonHandler = (event) => {
    this.props.history.push({
      pathname: "/uptime/sense/device/config",
    });
  };
  //////////////////Error policy///////////////////////////////////////////

  errorDisplayParameterSelectEventHandle = (event) => {
    let sys_config = { ...this.state.system_configuration };
    let errorCategory = null;
    let errorAction = null;

    if (event.target.value.indexOf("Exception") !== -1) {
      errorCategory = "Exception";
    } else if (event.target.value.indexOf("MajorError") !== -1) {
      errorCategory = "MajorError";
    } else if (event.target.value.indexOf("MinorError") !== -1) {
      errorCategory = "MinorError";
    } else if (event.target.value.indexOf("MajorWarning") !== -1) {
      errorCategory = "MajorWarning";
    } else if (event.target.value.indexOf("MinorWarning") !== -1) {
      errorCategory = "MinorWarning";
    }

    if (errorCategory !== null) {
      errorAction = event.target.value.substr(errorCategory.length + 1);
      switch (errorCategory) {
        case "Exception":
          sys_config.std_exception = errorAction;
          break;
        case "MajorError":
          sys_config.error_major = errorAction;
          break;
        case "MinorError":
          sys_config.error_minor = errorAction;
          break;
        case "MajorWarning":
          sys_config.warn_major = errorAction;
          break;
        case "MinorWarning":
          sys_config.warn_minor = errorAction;
          break;
        default:
          break;
      }

      this.setState({
        system_configuration: sys_config,
      });
    }
  };

  ////////////////////////Communication protocol UART, I2C /////////////////////////////////////////////////////////
  deviceTypeSelectEventHandle = (event) => {
    let sys_config = { ...this.state.system_configuration };
    sys_config.device_type = event.target.value;
    this.setState({
      system_configuration: sys_config,
    });
  };

  commProtocolBaudRateSelectEventHandle = (event) => {
    let config_data = { ...this.state.system_configuration };

    switch (event.target.value) {
      case "uart0baud2400":
        config_data.uart0_baud = "2400";
        break;
      case "uart0baud4800":
        config_data.uart0_baud = "4800";
        break;
      case "uart0baud9600":
        config_data.uart0_baud = "9600";
        break;
      case "uart0baud19200":
        config_data.uart0_baud = "19200";
        break;
      case "uart0baud38400":
        config_data.uart0_baud = "38400";
        break;
      case "uart0baud57600":
        config_data.uart0_baud = "57600";
        break;
      case "uart0baud115200":
        config_data.uart0_baud = "115200";
        break;
      case "uart0baud128000":
        config_data.uart0_baud = "128000";
        break;
      case "uart0baud256000":
        config_data.uart0_baud = "256000";
        break;

      case "uart1baud2400":
        config_data.uart1_baud = "2400";
        break;
      case "uart1baud4800":
        config_data.uart1_baud = "4800";
        break;
      case "uart1baud9600":
        config_data.uart1_baud = "9600";
        break;
      case "uart1baud19200":
        config_data.uart1_baud = "19200";
        break;
      case "uart1baud38400":
        config_data.uart1_baud = "38400";
        break;
      case "uart1baud57600":
        config_data.uart1_baud = "57600";
        break;
      case "uart1baud115200":
        config_data.uart1_baud = "115200";
        break;
      case "uart1baud128000":
        config_data.uart1_baud = "128000";
        break;
      case "uart1baud256000":
        config_data.uart1_baud = "256000";
        break;

      case "uart2baud2400":
        config_data.uart2_baud = "2400";
        break;
      case "uart2baud4800":
        config_data.uart2_baud = "4800";
        break;
      case "uart2baud9600":
        config_data.uart2_baud = "9600";
        break;
      case "uart2baud19200":
        config_data.uart2_baud = "19200";
        break;
      case "uart2baud38400":
        config_data.uart2_baud = "38400";
        break;
      case "uart2baud57600":
        config_data.uart2_baud = "57600";
        break;
      case "uart2baud115200":
        config_data.uart2_baud = "115200";
        break;
      case "uart2baud128000":
        config_data.uart2_baud = "128000";
        break;
      case "uart2baud256000":
        config_data.uart2_baud = "256000";
        break;

      default:
        break;
    }

    this.setState({
      system_configuration: config_data,
    });
  };

  commProtocolFreqSelectEventHandle = (event) => {
    let sys_config = { ...this.state.system_configuration };
    switch (event.target.value) {
      case "i2c0freq50KHz":
        sys_config.i2c0_freq = "50KHz";
        break;
      case "i2c0freq100KHz":
        sys_config.i2c0_freq = "100KHz";
        break;
      case "i2c0freq400KHz":
        sys_config.i2c0_freq = "400KHz";
        break;

      case "i2c1freq50KHz":
        sys_config.i2c1_freq = "50KHz";
        break;
      case "i2c1freq100KHz":
        sys_config.i2c1_freq = "100KHz";
        break;
      case "i2c1freq400KHz":
        sys_config.i2c1_freq = "400KHz";
        break;

      default:
        break;
    }
    this.setState({
      system_configuration: sys_config,
    });
  };

  wifiReconnectAttemptSelectEventHandle = (event) => {
    let sys_config = { ...this.state.system_configuration };
    sys_config.wifi_reconnect_attempt = event.target.value;
    this.setState({
      system_configuration: sys_config,
    });
  };

  wifiSSIDChangeHandler = (event) => {
    let sys_config = { ...this.state.system_configuration };

    switch (event.target.name) {
      case "AP1":
        sys_config.wifi_ssid1 = event.target.value;
        break;
      case "AP2":
        sys_config.wifi_ssid2 = event.target.value;
        break;
      case "AP3":
        sys_config.wifi_ssid3 = event.target.value;
        break;
      case "AP4":
        sys_config.wifi_ssid4 = event.target.value;
        break;
      case "AP5":
        sys_config.wifi_ssid5 = event.target.value;
        break;
      default:
        break;
    }

    this.setState({
      system_configuration: sys_config,
    });
  };

  wifiPasswordChangeHandler = (event) => {
    let sys_config = { ...this.state.system_configuration };

    switch (event.target.name) {
      case "AP1":
        sys_config.wifi_password1 = event.target.value;
        break;
      case "AP2":
        sys_config.wifi_password2 = event.target.value;
        break;
      case "AP3":
        sys_config.wifi_password3 = event.target.value;
        break;
      case "AP4":
        sys_config.wifi_password4 = event.target.value;
        break;
      case "AP5":
        sys_config.wifi_password5 = event.target.value;
        break;
      default:
        break;
    }

    this.setState({
      system_configuration: sys_config,
    });
  };

  onSaveAlertCloseHandler = (event) => {
    this.setState({
      onSaveAlert: false,
    });
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "handleSwitchButtonChange":
        this.handleSwitchButtonChange(event);
        break;
      case "menuSelectHandler":
        this.menuSelectHandler(event);
        break;
      case "NetworkIDEventHandle":
        this.NetworkIDEventHandle(event);
        break;
      case "DeviceDescriptionEventHandle":
        this.DeviceDescriptionEventHandle(event);
        break;
      case "saveButtonHandler":
        this.saveButtonHandler(event);
        break;
      case "backButtonHandler":
        this.backButtonHandler(event);
        break;
      case "removeButtonHandler":
        this.removeButtonHandler(event);
        break;
      case "menuBackButtonHandler":
        this.menuBackButtonHandler(event);
        break;
      case "errorDisplayParameterSelectEventHandle":
        this.errorDisplayParameterSelectEventHandle(event);
        break;
      case "deviceTypeSelectEventHandle":
        this.deviceTypeSelectEventHandle(event);
        break;
      case "commProtocolBaudRateSelectEventHandle":
        this.commProtocolBaudRateSelectEventHandle(event);
        break;
      case "commProtocolFreqSelectEventHandle":
        this.commProtocolFreqSelectEventHandle(event);
        break;
      case "wifiReconnectAttemptSelectEventHandle":
        this.wifiReconnectAttemptSelectEventHandle(event);
        break;
      case "wifiSSIDChangeHandler":
        this.wifiSSIDChangeHandler(event);
        break;
      case "wifiPasswordChangeHandler":
        this.wifiPasswordChangeHandler(event);
        break;
      case "onSaveAlertCloseHandler":
        this.onSaveAlertCloseHandler(event);
        break;
    }
  };

  mainMenuPanelContent = () => {
    const { triggerSubMenuAction } = this.props;
    const { children, overflowedIndicator } = this.state;
    return (
      <div>
        <Row>
          <Col sm="8">
            <Form.Label style={{ fontSize: "24px" }}>Select Configuration Category</Form.Label>
            <Menu
              style={{ width: "400px", height: "250px", backgroundColor: "#F8F8F8" }}
              onClick={(event) =>
                this.centralEventHandler("menuSelectHandler", event)
              }
              triggerSubMenuAction={triggerSubMenuAction}
            >
              {children}
            </Menu>
          </Col>
        </Row>

        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) =>
                this.centralEventHandler("menuBackButtonHandler", event)
              }
            >
              Back
            </Button>
          </Col>
        </Row>
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
                marginTop: "20px",
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
              Device UUID: {this.state.system_configuration.device_id}
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

  generalPanelContent = () => {
    const DeviceTypeConfigParameterOption = [
      {
        Gateway: "/uptime/sense/device/config/system/device-attributes/gateway",
      },
      { Node: "/uptime/sense/device/config/system/device-attributes/node" },
    ];
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Network ID</Form.Label>
                <Form.Control
                  placeholder="Enter Network ID"
                  type="number"
                  value={this.state.system_configuration.network_id}
                  onChange={(event) =>
                    this.centralEventHandler("NetworkIDEventHandle", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Device Type</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.system_configuration.device_type}
                  onChange={(event) =>
                    this.centralEventHandler(
                      "deviceTypeSelectEventHandle",
                      event
                    )
                  }
                >
                  {DeviceTypeConfigParameterOption.map((item, index) => {
                    return <option>{Object.keys(item)}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Device Description</Form.Label>
                <Form.Control
                  placeholder="Enter Device Description"
                  type="text"
                  value={this.state.system_configuration.device_description}
                  onChange={(event) =>
                    this.centralEventHandler(
                      "DeviceDescriptionEventHandle",
                      event
                    )
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) =>
                this.centralEventHandler("backButtonHandler", event)
              }
            >
              Back
            </Button>{" "}
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) =>
                this.centralEventHandler("saveButtonHandler", event)
              }
            >
              Save
            </Button>
          </Col>
        </Row>
        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant="info"
          show={this.state.onSaveAlert}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler", event)
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  uartPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="UART-0 Enabler"
                  checked={this.state.system_configuration.uart0_en}
                  name="UART0"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Baud Rate</Form.Label>
                <Form.Control
                  as="select"
                  value={`uart0baud${this.state.system_configuration.uart0_baud}`}
                  onChange={(event) =>
                    this.centralEventHandler(
                      "commProtocolBaudRateSelectEventHandle",
                      event
                    )
                  }
                >
                  {BaudRateConfigParameterOption.map((item, index) => {
                    return <option value={`uart0baud${item}`}>{item}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch2"
                  label="UART-1 Enabler"
                  checked={this.state.system_configuration.uart1_en}
                  name="UART1"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Baud Rate</Form.Label>
                <Form.Control
                  as="select"
                  value={`uart1baud${this.state.system_configuration.uart1_baud}`}
                  onChange={(event) =>
                    this.centralEventHandler(
                      "commProtocolBaudRateSelectEventHandle",
                      event
                    )
                  }
                >
                  {BaudRateConfigParameterOption.map((item, index) => {
                    return <option value={`uart1baud${item}`}>{item}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch3"
                  label="UART-2 Enabler"
                  checked={this.state.system_configuration.uart2_en}
                  name="UART2"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Baud Rate</Form.Label>
                <Form.Control
                  as="select"
                  value={`uart2baud${this.state.system_configuration.uart2_baud}`}
                  onChange={(event) =>
                    this.centralEventHandler(
                      "commProtocolBaudRateSelectEventHandle",
                      event
                    )
                  }
                >
                  {BaudRateConfigParameterOption.map((item, index) => {
                    return <option value={`uart2baud${item}`}>{item}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Col>
        </Row>

        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              className="Button"
              style={{
                backgroundColor: "#2997c2",
                width: "100px",
              }}
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

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant="info"
          show={this.state.onSaveAlert}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler", event)
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  i2cPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="I2C-0 Enabler"
                  checked={this.state.system_configuration.i2c0_en}
                  name="I2C0"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>I2C0 Frequency</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.centralEventHandler(
                      "commProtocolFreqSelectEventHandle",
                      event
                    )
                  }
                  value={`i2c0freq${this.state.system_configuration.i2c0_freq}`}
                >
                  {FreqencyConfigParameterOption.map((item, index) => {
                    return <option value={`i2c0freq${item}`}>{item}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Col>

          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch2"
                  label="I2C-1 Enabler"
                  checked={this.state.system_configuration.i2c1_en}
                  name="I2C1"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>I2C1 Frequency</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.centralEventHandler(
                      "commProtocolFreqSelectEventHandle",
                      event
                    )
                  }
                  value={`i2c1freq${this.state.system_configuration.i2c1_freq}`}
                >
                  {FreqencyConfigParameterOption.map((item, index) => {
                    return <option value={`i2c1freq${item}`}>{item}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Col>

          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch3"
                  label="HSPI Enabler "
                  checked={this.state.system_configuration.hsspi_en}
                  name="HSSPI"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch4"
                  label="LSPI Enabler"
                  checked={this.state.system_configuration.lsspi_en}
                  name="LSSPI"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              className="Button"
              style={{
                width: "100px",
                backgroundColor: "#2997c2",
              }}
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

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant="info"
          show={this.state.onSaveAlert}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler", event)
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  wifiPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Row>
              <Col>
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="Enable WiFi"
                  checked={this.state.system_configuration.wifi_en}
                  name="WIFI"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch2"
                  label="Enable WiFi Smart Connect"
                  checked={this.state.system_configuration.wifi_smartconnect_en}
                  name="SMARTCONN"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col sm="8">
                <Form.Label>Reconnect Attempt</Form.Label>
                <Form.Control
                  style={{ width: "200px" }}
                  as="select"
                  value={this.state.system_configuration.wifi_reconnect_attempt}
                  onChange={(event) =>
                    this.centralEventHandler(
                      "wifiReconnectAttemptSelectEventHandle",
                      event
                    )
                  }
                >
                  {WiFiConfigParameterOption.map((item, index) => {
                    return <option>{Object.keys(item)}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Row>
          <Row style={{ width: "150%" }} className="ml-auto">
            <Col sm="10">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "150px" }}>WiFi </th>
                    <th>Network Name</th>
                    <th>WiFi Password</th>
                    <th>Add WiFi Network</th>
                    <th>Remove WiFi Network</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Access Point 1</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            placeholder="SSID"
                            maxLength="20"
                            required={true}
                            name="AP1"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "wifiSSIDChangeHandler",
                                event
                              )
                            }
                            value={this.state.system_configuration.wifi_ssid1}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          maxLength="20"
                          required={true}
                          name="AP1"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "wifiPasswordChangeHandler",
                              event
                            )
                          }
                          value={this.state.system_configuration.wifi_password1}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      {" "}
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        onClick={(event) =>
                          this.centralEventHandler("saveButtonHandler", event)
                        }
                      >
                        ADD
                      </Button>
                    </td>
                    <td>
                      {" "}
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        name="AP1"
                        onClick={(event) =>
                          this.centralEventHandler("removeButtonHandler", event)
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Access Point 2</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="email"
                            placeholder="SSID"
                            maxLength="20"
                            required={true}
                            name="AP2"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "wifiSSIDChangeHandler",
                                event
                              )
                            }
                            value={this.state.system_configuration.wifi_ssid2}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          maxLength="20"
                          required={true}
                          name="AP2"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "wifiPasswordChangeHandler",
                              event
                            )
                          }
                          value={this.state.system_configuration.wifi_password2}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        onClick={(event) =>
                          this.centralEventHandler("saveButtonHandler", event)
                        }
                      >
                        ADD
                      </Button>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        name="AP2"
                        onClick={(event) =>
                          this.centralEventHandler("removeButtonHandler", event)
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Access Point 3</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="email"
                            placeholder="SSID"
                            maxLength="20"
                            required={true}
                            name="AP3"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "wifiSSIDChangeHandler",
                                event
                              )
                            }
                            value={this.state.system_configuration.wifi_ssid3}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          maxLength="20"
                          required={true}
                          name="AP3"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "wifiPasswordChangeHandler",
                              event
                            )
                          }
                          value={this.state.system_configuration.wifi_password3}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        onClick={(event) =>
                          this.centralEventHandler("saveButtonHandler", event)
                        }
                      >
                        ADD
                      </Button>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        name="AP3"
                        onClick={(event) =>
                          this.centralEventHandler("removeButtonHandler", event)
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Access Point 4</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="email"
                            placeholder="SSID"
                            maxLength="20"
                            required={true}
                            name="AP4"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "wifiSSIDChangeHandler",
                                event
                              )
                            }
                            value={this.state.system_configuration.wifi_ssid4}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          maxLength="20"
                          required={true}
                          name="AP4"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "wifiPasswordChangeHandler",
                              event
                            )
                          }
                          value={this.state.system_configuration.wifi_password4}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        onClick={(event) =>
                          this.centralEventHandler("saveButtonHandler", event)
                        }
                      >
                        ADD
                      </Button>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        name="AP4"
                        onClick={(event) =>
                          this.centralEventHandler("removeButtonHandler", event)
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Access Point 5</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="email"
                            placeholder="SSID"
                            maxLength="20"
                            required={true}
                            name="AP5"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "wifiSSIDChangeHandler",
                                event
                              )
                            }
                            value={this.state.system_configuration.wifi_ssid5}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          maxLength="20"
                          required={true}
                          name="AP5"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "wifiPasswordChangeHandler",
                              event
                            )
                          }
                          value={this.state.system_configuration.wifi_password5}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        onClick={(event) =>
                          this.centralEventHandler("saveButtonHandler", event)
                        }
                      >
                        ADD
                      </Button>
                    </td>
                    <td>
                      <Button
                        style={{ backgroundColor: "#2997c2" }}
                        className="TableButton"
                        name="AP5"
                        onClick={(event) =>
                          this.centralEventHandler("removeButtonHandler", event)
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Row>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
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

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant="info"
          show={this.state.onSaveAlert}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler", event)
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  statusIndicatorPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="Application Status Indicator"
                  checked={
                    this.state.system_configuration.appStatusIndicator_en
                  }
                  name="STATUSIND"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch2"
                  disabled={true}
                  label="WiFi Link Indicator"
                />
              </Col>
            </Row>
          </Col>

          <Col sm="6">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch3"
                  disabled={true}
                  label="LTE Link Indicator"
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch4"
                  disabled={true}
                  label="Bluetooth Link Indicator"
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              className="Button"
              style={{
                width: "100px",
                backgroundColor: "#2997c2",
              }}
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

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant="info"
          show={this.state.onSaveAlert}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler", event)
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  errorPolicyPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Standard Exception</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler(
                  "errorDisplayParameterSelectEventHandle",
                  event
                )
              }
              value={`Exception_${this.state.system_configuration.std_exception}`}
            >
              {ErrorDisplayConfigParameterOption.map((item, index) => {
                return <option value={`Exception_${item}`}>{item}</option>;
              })}
            </Form.Control>
          </Col>

          <br />

          <Col sm="4">
            <Form.Label>Major Error</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler(
                  "errorDisplayParameterSelectEventHandle",
                  event
                )
              }
              value={`MajorError_${this.state.system_configuration.error_major}`}
            >
              {ErrorDisplayConfigParameterOption.map((item, index) => {
                return <option value={`MajorError_${item}`}>{item}</option>;
              })}
            </Form.Control>
          </Col>

          <br />

          <Col sm="4">
            <Form.Label>Minor Error</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler(
                  "errorDisplayParameterSelectEventHandle",
                  event
                )
              }
              value={`MinorError_${this.state.system_configuration.error_minor}`}
            >
              {ErrorDisplayConfigParameterOption.map((item, index) => {
                return <option value={`MinorError_${item}`}>{item}</option>;
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Major Warning</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler(
                  "errorDisplayParameterSelectEventHandle",
                  event
                )
              }
              value={`MajorWarning_${this.state.system_configuration.warn_major}`}
            >
              {ErrorDisplayConfigParameterOption.map((item, index) => {
                return <option value={`MajorWarning_${item}`}>{item}</option>;
              })}
            </Form.Control>
          </Col>

          <Col sm="6">
            <Form.Label>Minor Warning</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler(
                  "errorDisplayParameterSelectEventHandle",
                  event
                )
              }
              value={`MinorWarning_${this.state.system_configuration.warn_minor}`}
            >
              {ErrorDisplayConfigParameterOption.map((item, index) => {
                return <option value={`MinorWarning_${item}`}>{item}</option>;
              })}
            </Form.Control>
          </Col>
        </Row>

        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              style={{ backgroundColor: "#2997c2" }}
              className="Button"
              onClick={(event) =>
                this.centralEventHandler("backButtonHandler", event)
              }
            >
              Back
            </Button>
            <Button
              style={{ backgroundColor: "#2997c2" }}
              className="Button"
              onClick={(event) =>
                this.centralEventHandler("saveButtonHandler", event)
              }
            >
              Save
            </Button>
          </Col>
        </Row>

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant="info"
          show={this.state.onSaveAlert}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler", event)
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  render() {
    switch (this.state.pageStatus) {
      case "main-menu":
        return (
          <div>
            {this.navbarInterface("System Configuration")}
            <Container>
              {this.panelInterface("", this.mainMenuPanelContent())}
            </Container>
          </div>
        );
        break;

      case "general":
        return (
          <div>
            {this.navbarInterface("General")}
            <Container>
              {this.panelInterface("", this.generalPanelContent())}
            </Container>
          </div>
        );
        break;

      case "UART":
        return (
          <div>
            {this.navbarInterface("UART")}
            <Container>
              {this.panelInterface("", this.uartPanelContent())}
            </Container>
          </div>
        );
        break;

      case "I2C/SPI":
        return (
          <div>
            {this.navbarInterface("I2C/SPI")}
            <Container>
              {this.panelInterface("", this.i2cPanelContent())}
            </Container>
          </div>
        );

        break;
      case "WIFI":
        return (
          <div>
            {this.navbarInterface("WIFI")}
            <Container>
              {this.panelInterface("", this.wifiPanelContent())}
            </Container>
          </div>
        );
        break;

      case "Status Indicator":
        return (
          <div>
            {this.navbarInterface("Status Indication")}
            <Container>
              {this.panelInterface("", this.statusIndicatorPanelContent())}
            </Container>
          </div>
        );
        break;

      case "Error-Policy":
        return (
          <div>
            {this.navbarInterface("Error Policy")}
            <Container>
              {this.panelInterface("", this.errorPolicyPanelContent())}
            </Container>
          </div>
        );
        break;
    }
  }
}

systemConfigPage.propTypes = {
  mode: PropTypes.string,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  triggerSubMenuAction: PropTypes.string,
  defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
};

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

export default connect(mapStateToProps, mapDispatchToProps)(systemConfigPage);
