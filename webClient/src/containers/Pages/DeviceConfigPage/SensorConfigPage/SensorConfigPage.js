import React, { Component } from "react";
import PropTypes from "prop-types";
import Menu, { SubMenu, Item as MenuItem } from "rc-menu";
import "rc-menu/assets/index.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./SensorConfigPage.css";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import { connect } from "react-redux";
import IMUFilter from "./IMUFilters";

const menuCardLevel1 = [
  <SubMenu
    title={<span className="submenu-title-wrapper">BMI 160</span>}
    key="1"
  >
    <MenuItem style={{ backgroundColor: "white", color: "#2997c2" }} key="1-1">
      General
    </MenuItem>
    <MenuItem style={{ backgroundColor: "white", color: "#2997c2" }} key="1-2">
      Gyroscope
    </MenuItem>
    <MenuItem style={{ backgroundColor: "white", color: "#2997c2" }} key="1-3">
      Accelerometer
    </MenuItem>
    <MenuItem style={{ backgroundColor: "white", color: "#2997c2" }} key="1-4">
      Filters/Algorithm
    </MenuItem>
  </SubMenu>,

  <SubMenu
    title={<span className="submenu-title-wrapper">BME 280</span>}
    key="2"
  >
    <MenuItem style={{ backgroundColor: "white", color: "#2997c2" }} key="2-1">
      General
    </MenuItem>
  </SubMenu>,

  <SubMenu title={<span className="submenu-title-wrapper">GPS</span>} key="4">
    <MenuItem style={{ backgroundColor: "white", color: "#2997c2" }} key="4-1">
      General
    </MenuItem>
  </SubMenu>,
];

const sensor_Peripheral_Comm_ParameterOption = [
  { hsspi: "High speed SPI" },
  { lsspi: "Low speed SPI" },
  { uart0: "UART 0" },
  { uart1: "UART 1" },
  { uart2: "UART 2" },
  { i2c0: "I2C 0" },
  { i2c1: "I2C 1" },
];

const sensor_telemetry_ParameterOption = [
  { mqtt: "MQTT client" },
  { influx: "Influx client" },
  { ble: "BLE" },
  { wifi_tcp: "WIFI TCP" },
  { wifi_udp: "WIFI UDP" },
  { hsspi: "High speed SPI" },
  { lsspi: "Low speed SPI" },
  { uart0: "UART 0" },
  { uart1: "UART 1" },
  { uart2: "UART 2" },
  { i2c0: "I2C 0" },
  { i2c1: "I2C 1" },
];
///////////////// class///////////////////////////////////////////

class SensorConfigPage extends Component {
  state = {
    displayMenu: menuCardLevel1,
    selectedItem: null,
    pageStatus: "main-menu",
    onSaveAlert: false,
    sensorConfigAttrib: {
      //BMI160 attributes
      operation: "sensor",
      device_id: this.props.location.state.deviceid,
      file_type: "sensor",
      bmi160_en: false,
      bmi160_id: "",
      bmi160_description: "",
      bmi160_measurement_type: "",
      bmi160_measurement_topic: "",
      bmi160_last_msg_topic: "",
      bmi160_peripheral_comm_interface: "",
      bmi160_peripheral_comm_address_dec: "0",
      bmi160_telemetry_interface: "",
      bmi160_sampling_frequency: "0",

      //GYRO
      bmi160_gyroscope_range: "0",
      bmi160_gyro_x_offset: "0",
      bmi160_gyro_y_offset: "0",
      bmi160_gyro_z_offset: "0",
      bmi160_gyro_bais_x: "0",
      bmi160_gyro_bais_y: "0",
      bmi160_gyro_bais_z: "0",

      //Acc
      bmi160_accelerometerRange: "0",
      bmi160_acc_x_offset: "0",
      bmi160_acc_y_offset: "0",
      bmi160_acc_z_offset: "0",


      //BME280
      bme280_en: false,
      bme280_id: "",
      bme280_description: "",
      bme280_measurement_type: "",
      bme280_measurement_topic: "",
      bme280_last_msg_topic: "",
      bme280_peripheral_comm_interface: "",
      bme280_peripheral_comm_address_dec: "0",
      bme280_telemetry_interface: "",
      bme280_sea_level_atm_pressure: "0",
      //GPS
      gps_en: false,
      gps_id: "",
      gps_description: "",
      gps_measurement_type: "",
      gps_measurement_topic: "",
      gps_last_msg_topic: "",
      gps_peripheral_comm_interface: "",
      gps_peripheral_comm_address_dec: "0",
      gps_telemetry_interface: "",
    },
  };

  printFunctionSupported = (obj) => {
    console.log(Object.getOwnPropertyNames(obj).filter(function (x) {
      return typeof obj[x] === 'function'
    }));
  }


  componentDidMount() {
    const data = {
      operation: "sensor",
      device_id: this.state.sensorConfigAttrib.device_id,
    };
    axios
      .get(this.props.server_address + "/uptime/sense/device/config", {
        params: data,
      })
      .then((response) => {
        let temp = { ...this.state.sensorConfigAttrib };
        temp.device_id = response.data["device_id"],
          temp.file_type = response.data["file_type"],
          temp.bmi160_en = response.data["bmi160_en"],
          temp.bmi160_id = response.data["bmi160_id"],
          temp.bmi160_description = response.data["bmi160_description"],
          temp.bmi160_measurement_type =
          response.data["bmi160_measurement_type"],
          temp.bmi160_measurement_topic =
          response.data["bmi160_measurement_topic"],
          temp.bmi160_last_msg_topic = response.data["bmi160_last_msg_topic"],
          temp.bmi160_peripheral_comm_interface =
          response.data["bmi160_peripheral_comm_interface"],
          temp.bmi160_peripheral_comm_address_dec =
          response.data["bmi160_peripheral_comm_address_dec"],
          temp.bmi160_telemetry_interface =
          response.data["bmi160_telemetry_interface"],
          //GYRO
          temp.bmi160_gyroscope_range =
          response.data["bmi160_gyroscope_range"],
          temp.bmi160_gyro_x_offset = response.data["bmi160_gyro_x_offset"],
          temp.bmi160_gyro_y_offset = response.data["bmi160_gyro_y_offset"],
          temp.bmi160_gyro_z_offset = response.data["bmi160_gyro_z_offset"],
          temp.bmi160_gyro_bais_x = response.data["bmi160_gyro_bais_x"],
          temp.bmi160_gyro_bais_y = response.data["bmi160_gyro_bais_y"],
          temp.bmi160_gyro_bais_z = response.data["bmi160_gyro_bais_z"],
          //Acc
          temp.bmi160_accelerometerRange =
          response.data["bmi160_accelerometerRange"],
          temp.bmi160_acc_x_offset = response.data["bmi160_acc_x_offset"],
          temp.bmi160_acc_y_offset = response.data["bmi160_acc_y_offset"],
          temp.bmi160_acc_z_offset = response.data["bmi160_acc_z_offset"],
          temp.bmi160_sampling_frequency =
          response.data["bmi160_sampling_frequency"],
          //BME280
          temp.bme280_en = response.data["bme280_en"],
          temp.bme280_id = response.data["bme280_id"],
          temp.bme280_description = response.data["bme280_description"],
          temp.bme280_measurement_type =
          response.data["bme280_measurement_type"],
          temp.bme280_measurement_topic =
          response.data["bme280_measurement_topic"],
          temp.bme280_last_msg_topic = response.data["bme280_last_msg_topic"],
          temp.bme280_peripheral_comm_interface =
          response.data["bme280_peripheral_comm_interface"],
          temp.bme280_peripheral_comm_address_dec =
          response.data["bme280_peripheral_comm_address_dec"],
          temp.bme280_telemetry_interface =
          response.data["bme280_telemetry_interface"],
          temp.bme280_sea_level_atm_pressure =
          response.data["bme280_sea_level_atm_pressure"],
          //GPS
          temp.gps_en = response.data["gps_en"],
          temp.gps_id = response.data["gps_id"],
          temp.gps_description = response.data["gps_description"],
          temp.gps_measurement_type = response.data["gps_measurement_type"],
          temp.gps_measurement_topic = response.data["gps_measurement_topic"],
          temp.gps_last_msg_topic = response.data["gps_last_msg_topic"],
          temp.gps_peripheral_comm_interface =
          response.data["gps_peripheral_comm_interface"],
          temp.gps_peripheral_comm_address_dec =
          response.data["gps_peripheral_comm_address_dec"],
          temp.gps_telemetry_interface =
          response.data["gps_telemetry_interface"],
          this.setState({
            sensorConfigAttrib: temp,
          });
      });
  }

  //========== menu select handler ===========
  menuSelectHandler = (info) => {
    this.setState({
      selectedItem: info.key,
    });

    switch (info.key) {
      case "1-1":
        this.setState({
          pageStatus: "BMI Sensor Attributes",
        });
        break;
      case "1-2":
        this.setState({
          pageStatus: "Gyroscope",
        });
        break;
      case "1-3":
        this.setState({
          pageStatus: "Accelerometer",
        });
        break;
      case "1-4":
        this.setState({
          pageStatus: "IMU Filter",
        });
        break;
      case "2-1":
        this.setState({
          pageStatus: "BME280",
        });
        break;

      case "4-1":
        this.setState({
          pageStatus: "GPS",
        });
        break;
      default:
        break;
    }
  };

  /////////////////////////////Button handler//////////////////////////////////
  saveButtonHandler = (event) => {
    this.setState({
      onSaveAlert: true,
    });
    setTimeout(this.onSaveAlertCloseHandler, 2000);

    let post_data = { ...this.state.sensorConfigAttrib };
    axios
      .post(
        this.props.server_address + "/uptime/sense/device/config",
        post_data
      )
      .then((response) => {
        // if(response.data["status"]==="success"){

        // }
      });
  };

  onSaveAlertCloseHandler = (event) => {
    this.setState({
      onSaveAlert: false,
    });
  };

  backButtonHandler = (event) => {
    this.setState({
      pageStatus: "main-menu",
    });
  };

  menuBackButtonHandler = (event) => {
    this.props.history.push({
      pathname: "/uptime/sense/device/config",
    });
  };

  bmi160ChangeHandler = (event) => {
    let sensor_config = { ...this.state.sensorConfigAttrib };
    switch (event.target.name) {
      case "enable_switch":
        sensor_config.bmi160_en = !sensor_config.bmi160_en;
        break;
      case "device_id":
        sensor_config.bmi160_id = event.target.value;
        break;
      case "description":
        sensor_config.bmi160_description = event.target.value;
        break;
      case "measurementType":
        sensor_config.bmi160_measurement_type = event.target.value;
        break;
      case "measurementTopic":
        sensor_config.bmi160_measurement_topic = event.target.value;
        break;
      case "lastMessageTopic":
        sensor_config.bmi160_last_msg_topic = event.target.value;
        break;
      case "peripheralAddress":
        sensor_config.bmi160_peripheral_comm_address_dec = event.target.value;
        break;
      case "peripheralInterfaceSelection":
        sensor_config.bmi160_peripheral_comm_interface = event.target.value;
        break;
      case "telemetryInterfaceSelection":
        sensor_config.bmi160_telemetry_interface = event.target.value;
        break;
      // GYRO
      case "bmi160_gyroscope_range":
        sensor_config.bmi160_gyroscope_range = event.target.value;
        break;
      case "bmi160_gyro_x_offset":
        sensor_config.bmi160_gyro_x_offset = event.target.value;
        break;
      case "bmi160_gyro_y_offset":
        sensor_config.bmi160_gyro_y_offset = event.target.value;
        break;
      case "bmi160_gyro_z_offset":
        sensor_config.bmi160_gyro_z_offset = event.target.value;
        break;
      case "bmi160_gyro_bais_x":
        sensor_config.bmi160_gyro_bais_x = event.target.value;
        break;
      case "bmi160_gyro_bais_y":
        sensor_config.bmi160_gyro_bais_y = event.target.value;
        break;
      case "bmi160_gyro_bais_z":
        sensor_config.bmi160_gyro_bais_z = event.target.value;
        break;
      //Acc
      case "bmi160_accelerometerRange":
        sensor_config.bmi160_accelerometerRange = event.target.value;
        break;
      case "bmi160_acc_x_offset":
        sensor_config.bmi160_acc_x_offset = event.target.value;
        break;
      case "bmi160_acc_y_offset":
        sensor_config.bmi160_acc_y_offset = event.target.value;
        break;
      case "bmi160_acc_z_offset":
        sensor_config.bmi160_acc_z_offset = event.target.value;
        break;
      case "bmi160_sampling_frequency":
        sensor_config.bmi160_sampling_frequency = event.target.value;
        break;
      default:
        break;
    }
    this.setState({
      sensorConfigAttrib: sensor_config,
    });
  };
  // BME280
  bme280ChangeHandler = (event) => {
    let sensor_config = { ...this.state.sensorConfigAttrib };
    switch (event.target.name) {
      case "enable_switch":
        sensor_config.bme280_en = !sensor_config.bme280_en;
        break;
      case "bme280_id":
        sensor_config.bme280_id = event.target.value;
        break;
      case "bme280_description":
        sensor_config.bme280_description = event.target.value;
        break;
      case "bme280_measurement_type":
        sensor_config.bme280_measurement_type = event.target.value;
        break;
      case "bme280_measurement_topic":
        sensor_config.bme280_measurement_topic = event.target.value;
        break;
      case "bme280_last_msg_topic":
        sensor_config.bme280_last_msg_topic = event.target.value;
        break;
      case "bme280_peripheral_comm_interface":
        sensor_config.bme280_peripheral_comm_interface = event.target.value;
        break;
      case "bme280_peripheral_comm_address_dec":
        sensor_config.bme280_peripheral_comm_address_dec = event.target.value;
        break;
      case "bme280_telemetry_interface":
        sensor_config.bme280_telemetry_interface = event.target.value;
        break;
      case "bme280_sea_level_atm_pressure":
        sensor_config.bme280_sea_level_atm_pressure = event.target.value;
        break;
      default:
        break;
    }
    this.setState({
      sensorConfigAttrib: sensor_config,
    });
  };

  // GPS
  gpsChangeHandler = (event) => {
    let sensor_config = { ...this.state.sensorConfigAttrib };
    switch (event.target.name) {
      case "enable_switch":
        sensor_config.gps_en = !sensor_config.gps_en;
        break;
      case "gps_id":
        sensor_config.gps_id = event.target.value;
        break;
      case "gps_description":
        sensor_config.gps_description = event.target.value;
        break;
      case "gps_measurement_type":
        sensor_config.gps_measurement_type = event.target.value;
        break;
      case "gps_measurement_topic":
        sensor_config.gps_measurement_topic = event.target.value;
        break;
      case "gps_last_msg_topic":
        sensor_config.gps_last_msg_topic = event.target.value;
        break;
      case "gps_peripheral_comm_interface":
        sensor_config.gps_peripheral_comm_interface = event.target.value;
        break;
      case "gps_peripheral_comm_address_dec":
        sensor_config.gps_peripheral_comm_address_dec = event.target.value;
        break;
      case "gps_telemetry_interface":
        sensor_config.gps_telemetry_interface = event.target.value;
        break;
      default:
        break;
    }
    this.setState({
      sensorConfigAttrib: sensor_config,
    });
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "gpsChangeHandler":
        this.gpsChangeHandler(event);
        break;
      case "bme280ChangeHandler":
        this.bme280ChangeHandler(event);
        break;
      case "bmi160ChangeHandler":
        this.bmi160ChangeHandler(event);
        break;
      case "saveButtonHandler":
        this.saveButtonHandler(event);
        break;
      case "backButtonHandler":
        this.backButtonHandler(event);
        break;
      case "menuBackButtonHandler":
        this.menuBackButtonHandler(event);
        break;
      case "onSaveAlertCloseHandler":
        this.onSaveAlertCloseHandler(event);
        break;
      case "menuSelectHandler":
        this.menuSelectHandler(event);
        break;
      default:
        break;
    }
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
                fontWeight: "bold",
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
              Device UUID: {this.state.sensorConfigAttrib.device_id}
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

  mainMenuPanelContent = () => {
    const { triggerSubMenuAction } = this.props;
    const { displayMenu: children, overflowedIndicator } = this.state;
    return (
      <div>
        <Row>
          <Form.Label style={{ fontSize: "20px" }}>Sensor Picker</Form.Label>
        </Row>
        <Row>
          <Col sm lg="3">
            <Menu
              style={{
                height: "200px",
                backgroundColor: "white",
                color: "#2997c2",
              }}
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
          <Col sm lg="8">
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

  bmi160GeneralPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Sensor ID</Form.Label>
                <Form.Control
                  placeholder="Enter Sensor ID"
                  label="Sensor ID"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_id}
                  name="device_id"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  placeholder="Enter Description"
                  type="text"
                  value={this.state.sensorConfigAttrib.bmi160_description}
                  name="description"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Measurement Type</Form.Label>
                <Form.Control
                  placeholder="Enter Measurement Type"
                  type="text"
                  value={this.state.sensorConfigAttrib.bmi160_measurement_type}
                  name="measurementType"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Measurement Topic</Form.Label>
                <Form.Control
                  placeholder="Enter Measurement Topic"
                  type="text"
                  value={this.state.sensorConfigAttrib.bmi160_measurement_topic}
                  name="measurementTopic"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Sampling Frequency</Form.Label>
                <Form.Control
                  placeholder="Enter Sampling Frequency"
                  type="number"
                  value={
                    this.state.sensorConfigAttrib.bmi160_sampling_frequency
                  }
                  name="bmi160_sampling_frequency"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
          </Col>

          <Col>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Last Message Topic</Form.Label>
                <Form.Control
                  placeholder="Enter Last Message Topic"
                  type="text"
                  value={this.state.sensorConfigAttrib.bmi160_last_msg_topic}
                  name="lastMessageTopic"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />

            <Row>
              <Col sm="8">
                <Form.Label>Peripheral Communication Interface</Form.Label>
                <Form.Control
                  as="select"
                  name="peripheralInterfaceSelection"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                  value={
                    this.state.sensorConfigAttrib
                      .bmi160_peripheral_comm_interface
                  }
                >
                  {sensor_Peripheral_Comm_ParameterOption.map((item, index) => {
                    return (
                      <option value={Object.keys(item)}>
                        {Object.values(item)}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Peripheral Communication Address</Form.Label>
                <Form.Control
                  placeholder="Enter Peripheral Communication Address"
                  type="text"
                  value={
                    this.state.sensorConfigAttrib
                      .bmi160_peripheral_comm_address_dec
                  }
                  name="peripheralAddress"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Telemetry Interface</Form.Label>
                <Form.Control
                  as="select"
                  name="telemetryInterfaceSelection"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                  value={
                    this.state.sensorConfigAttrib.bmi160_telemetry_interface
                  }
                >
                  {sensor_telemetry_ParameterOption.map((item, index) => {
                    return (
                      <option value={Object.keys(item)}>
                        {Object.values(item)}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="Sensor Enabler"
                  style={{ marginTop: "25px" }}
                  checked={this.state.sensorConfigAttrib.bmi160_en}
                  name="enable_switch"
                  onClick={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
            <br />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              name="backButtonHandler"
              onClick={(event) => this.centralEventHandler("backButtonHandler")}
            >
              Back
            </Button>{" "}
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              name="saveButtonHandler"
              onClick={(event) => this.centralEventHandler("saveButtonHandler")}
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
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  bmi160GyroPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="5">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Gyroscope X axis offset (in degree)</Form.Label>
                <Form.Control
                  placeholder="Enter Gyroscope X axis offset"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_gyro_x_offset}
                  name="bmi160_gyro_x_offset"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Gyroscope Y axis offset (in degree)</Form.Label>
                <Form.Control
                  placeholder="Enter Gyroscope Y axis offset"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_gyro_y_offset}
                  name="bmi160_gyro_y_offset"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Gyroscope Z axis offset (in degree)</Form.Label>
                <Form.Control
                  placeholder="Enter Gyroscope z axis offset"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_gyro_z_offset}
                  name="bmi160_gyro_z_offset"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Gyroscope Range (in degree/sec)</Form.Label>
                <Form.Control
                  placeholder="Enter Gyroscope Range"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_gyroscope_range}
                  name="bmi160_gyroscope_range"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
          </Col>

          <Col sm="5">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Gyroscope Bias X axis (in degree/sec)</Form.Label>
                <Form.Control
                  placeholder="Enter Gyroscope Bias X axis"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_gyro_bais_x}
                  name="bmi160_gyro_bais_x"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Gyroscope Bias Y axis (in degree/sec)</Form.Label>
                <Form.Control
                  placeholder="Enter Gyroscope Bias Y axis"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_gyro_bais_y}
                  name="bmi160_gyro_bais_y"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Gyroscope Bias Z axis (in degree/sec)</Form.Label>
                <Form.Control
                  placeholder="Enter Gyroscope Bias Z axis"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_gyro_bais_z}
                  name="bmi160_gyro_bais_z"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
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
              onClick={(event) => this.centralEventHandler("backButtonHandler")}
            >
              Back
            </Button>{" "}
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => this.centralEventHandler("saveButtonHandler")}
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

  bmi160AccelPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="5">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Accelerometer X axis offset (in g)</Form.Label>
                <Form.Control
                  placeholder="Enter Accelerometer X axis offset"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_acc_x_offset}
                  name="bmi160_acc_x_offset"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Accelerometer Z axis offset (in g)</Form.Label>
                <Form.Control
                  placeholder="Enter Accelerometer z axis offset"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_acc_z_offset}
                  name="bmi160_acc_z_offset"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
          </Col>

          <Col sm="5">

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Accelerometer Y axis offset (in g)</Form.Label>
                <Form.Control
                  placeholder="Enter Accelerometer Y axis offset"
                  type="number"
                  value={this.state.sensorConfigAttrib.bmi160_acc_y_offset}
                  name="bmi160_acc_y_offset"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Accelerometer Range (in g)</Form.Label>
                <Form.Control
                  placeholder="Enter Accelerometer Range"
                  type="number"
                  value={
                    this.state.sensorConfigAttrib.bmi160_accelerometerRange
                  }
                  name="bmi160_accelerometerRange"
                  onChange={(event) =>
                    this.centralEventHandler("bmi160ChangeHandler", event)
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
              onClick={(event) => this.centralEventHandler("backButtonHandler")}
            >
              Back
            </Button>{" "}
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => this.centralEventHandler("saveButtonHandler")}
            >
              Save
            </Button>
          </Col>
        </Row>
        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant={"info"}
          show={this.state.onSaveAlert}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  bme280GeneralPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Sensor ID</Form.Label>
                <Form.Control
                  placeholder="Enter Sensor ID"
                  type="number"
                  value={this.state.sensorConfigAttrib.bme280_id}
                  name="bme280_id"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  placeholder="Enter Description"
                  type="text"
                  value={this.state.sensorConfigAttrib.bme280_description}
                  name="bme280_description"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Measurement Type</Form.Label>
                <Form.Control
                  placeholder="Enter Measurement Type"
                  type="text"
                  value={this.state.sensorConfigAttrib.bme280_measurement_type}
                  name="bme280_measurement_type"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Measurement Topic</Form.Label>
                <Form.Control
                  placeholder="Measurement Topic"
                  type="text"
                  value={this.state.sensorConfigAttrib.bme280_measurement_topic}
                  name="bme280_measurement_topic"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
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
                  label="Enable BME280"
                  style={{ marginTop: "25px" }}
                  checked={this.state.sensorConfigAttrib.bme280_en}
                  name="enable_switch"
                  onClick={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                />
              </Col>
            </Row>
          </Col>

          <Col sm="6">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Last Message Topic</Form.Label>
                <Form.Control
                  placeholder="Last Message Topic"
                  type="text"
                  value={this.state.sensorConfigAttrib.bme280_last_msg_topic}
                  name="bme280_last_msg_topic"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Peripheral Communication Interface</Form.Label>
                <Form.Control
                  as="select"
                  value={
                    this.state.sensorConfigAttrib
                      .bme280_peripheral_comm_interface
                  }
                  name="bme280_peripheral_comm_interface"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                >
                  {sensor_Peripheral_Comm_ParameterOption.map((item, index) => {
                    return (
                      <option value={Object.keys(item)}>
                        {Object.values(item)}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Peripheral Communication Address</Form.Label>
                <Form.Control
                  placeholder="Enter  BME280 Peripheral Communication Address Description "
                  type="text"
                  value={
                    this.state.sensorConfigAttrib
                      .bme280_peripheral_comm_address_dec
                  }
                  name="bme280_peripheral_comm_address_dec"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Telemetry Interface</Form.Label>
                <Form.Control
                  as="select"
                  value={
                    this.state.sensorConfigAttrib.bme280_telemetry_interface
                  }
                  name="bme280_telemetry_interface"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
                  }
                >
                  {sensor_telemetry_ParameterOption.map((item, index) => {
                    return (
                      <option value={Object.keys(item)}>
                        {Object.values(item)}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Sea Level Atmosphere Pressure</Form.Label>
                <Form.Control
                  placeholder="Enter BME280 Sea Level Atmosphere Pressure"
                  type="number"
                  value={
                    this.state.sensorConfigAttrib.bme280_sea_level_atm_pressure
                  }
                  name="bme280_sea_level_atm_pressure"
                  onChange={(event) =>
                    this.centralEventHandler("bme280ChangeHandler", event)
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
              onClick={(event) => this.centralEventHandler("backButtonHandler")}
            >
              Back
            </Button>{" "}
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => this.centralEventHandler("saveButtonHandler")}
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
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };

  gpsGeneralPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Sensor ID</Form.Label>
                <Form.Control
                  placeholder="Enter Sensor ID"
                  type="number"
                  value={this.state.sensorConfigAttrib.gps_id}
                  name="gps_id"
                  onChange={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  placeholder="Enter Description"
                  type="text"
                  value={this.state.sensorConfigAttrib.gps_description}
                  name="gps_description"
                  onChange={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Measurement Type</Form.Label>
                <Form.Control
                  placeholder="Enter Measurement Type"
                  type="text"
                  value={this.state.sensorConfigAttrib.gps_measurement_type}
                  name="gps_measurement_type"
                  onChange={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Measurement Topic</Form.Label>
                <Form.Control
                  placeholder="Enter Measurement Topic"
                  type="text"
                  value={this.state.sensorConfigAttrib.gps_measurement_topic}
                  name="gps_measurement_topic"
                  onChange={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                />
              </Col>
            </Row>
          </Col>

          <Col sm="6">
            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Last Message Topic</Form.Label>
                <Form.Control
                  placeholder="Enter Last Message Topic"
                  type="text"
                  value={this.state.sensorConfigAttrib.gps_last_msg_topic}
                  name="gps_last_msg_topic"
                  onChange={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Peripheral Communication Interface</Form.Label>
                <Form.Control
                  as="select"
                  value={
                    this.state.sensorConfigAttrib.gps_peripheral_comm_interface
                  }
                  name="gps_peripheral_comm_interface"
                  onClick={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                >
                  {sensor_Peripheral_Comm_ParameterOption.map((item, index) => {
                    return (
                      <option value={Object.keys(item)}>
                        {Object.values(item)}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Peripheral Communication Address</Form.Label>
                <Form.Control
                  placeholder="Enter  GPS Peripheral Communication Address Description "
                  type="text"
                  value={
                    this.state.sensorConfigAttrib
                      .gps_peripheral_comm_address_dec
                  }
                  name="gps_peripheral_comm_address_dec"
                  onChange={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Telemetry Interface</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.sensorConfigAttrib.gps_telemetry_interface}
                  name="gps_telemetry_interface"
                  onClick={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
                  }
                >
                  {sensor_telemetry_ParameterOption.map((item, index) => {
                    return (
                      <option value={Object.keys(item)}>
                        {Object.values(item)}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch3"
                  label="Enable GPS"
                  style={{ marginTop: "25px" }}
                  checked={this.state.sensorConfigAttrib.gps_en}
                  name="enable_switch"
                  onClick={(event) =>
                    this.centralEventHandler("gpsChangeHandler", event)
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
              onClick={(event) => this.centralEventHandler("backButtonHandler")}
            >
              Back
            </Button>{" "}
            <Button
              variant="primary"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => this.centralEventHandler("saveButtonHandler")}
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
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>Data saved successfully</div>
        </Alert>
      </div>
    );
  };
  /////////////////////////////////////////////////////////////////////
  render() {
    const { triggerSubMenuAction } = this.props;
    const { displayMenu: children, overflowedIndicator } = this.state;

    /////////////////////////////////////////////////////////////////////////

    switch (this.state.pageStatus) {
      case "main-menu":
        return (
          <div>
            {this.navbarInterface("Sensor Configuration")}
            <Container>
              {this.panelInterface("", this.mainMenuPanelContent())}
            </Container>
          </div>
        );


      case "BMI Sensor Attributes":
        return (
          <div>
            {this.navbarInterface("BMI 160 General Attributes")}
            <Container>
              {this.panelInterface("", this.bmi160GeneralPanelContent())}
            </Container>
          </div>
        );


      case "Gyroscope":
        return (
          <div>
            {this.navbarInterface("BMI 160 Gyro Attributes")}
            <Container>
              {this.panelInterface("", this.bmi160GyroPanelContent())}
            </Container>
          </div>
        );


      case "Accelerometer":
        return (
          <div>
            {this.navbarInterface("BMI 160 Accelerometer Attributes")}
            <Container>
              {this.panelInterface("", this.bmi160AccelPanelContent())}
            </Container>
          </div>
        );

      case "IMU Filter":
        return (
          <div>
            <IMUFilter
              history={this.props.history}
              device_id={this.state.sensorConfigAttrib.device_id} />
          </div>
        )


      case "BME280":
        return (
          <div>
            {this.navbarInterface("BME 280 General Attributes")}
            <Container>
              {this.panelInterface("", this.bme280GeneralPanelContent())}
            </Container>
          </div>
        );



      case "GPS":
        return (
          <div>
            {this.navbarInterface("GPS General Attributes")}
            <Container>
              {this.panelInterface("", this.gpsGeneralPanelContent())}
            </Container>
          </div>
        );

      default:
        return (<div></div>)
    }
  }
}

SensorConfigPage.propTypes = {
  mode: PropTypes.string,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  triggerSubMenuAction: PropTypes.string,
  defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
  // updateChildrenAndOverflowedIndicator: PropTypes.bool,
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

export default connect(mapStateToProps, mapDispatchToProps)(SensorConfigPage);
