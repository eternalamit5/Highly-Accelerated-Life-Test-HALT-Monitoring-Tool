import React, { Component } from "react";
import PropTypes from "prop-types";
import Menu, { SubMenu, Item as MenuItem } from "rc-menu";
import "rc-menu/assets/index.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import "./NestedSelectMenu.css";
// import { MDBSwitch } from "mdbreact";

const children1 = [
  <SubMenu
    title={<span className="submenu-title-wrapper">Device Attributes</span>}
    key="1"
  >
    <MenuItem key="1-1">Device Properties</MenuItem>
  </SubMenu>,

  <SubMenu
    title={
      <span className="submenu-title-wrapper">Communication Protocol</span>
    }
    key="2"
  >
    <MenuItem key="2-1">UART</MenuItem>
    <MenuItem key="2-2">I2C</MenuItem>
    <MenuItem key="2-3">WIFI</MenuItem>
  </SubMenu>,
  // <MenuItem key="3">Error Policy</MenuItem>,
  <MenuItem key="4">Error Policy</MenuItem>,
];

///////////////// class///////////////////////////////////////////

class NestedSelectMenu extends React.Component {
  state = {
    children: children1,
    overflowedIndicator: undefined,
    selectedItem: null,
    pageStatus: "main-menu",
    errorDisplaySelectedParamter: "NONE",
    errorSelectedParamter: "NONE",
    //Uart
    Uart0selectedParamter: "Enable",
    Uart1selectedParamter: "Enable",
    Uart2selectedParamter: "Enable",
    uart0baud: null,
    uart1baud: null,
    uart2baud: null,

    //I2C
    I2C0selectedParamter: "Enable",
    I2C1selectedParamte: "Enable",
    I2C2selectedParamte: "Enable",
    i2c0freq: null,
    i2c1freq: null,
    i2c2freq: null,

    // wifi
    WiFiNetworkNumber: "WiFi1",
    WiFiSmartSelectedParamter: "Enable",

    wifissid1: null,
    wifissid2: null,
    wifissid3: null,
    wifissid4: null,
    wifissid5: null,
    wifissid6: null,
    wifissid7: null,
    wifissid8: null,
    wifissid9: null,
    wifissid10: null,

    wifipassword1: null,
    wifipassword2: null,
    wifipassword3: null,
    wifipassword4: null,
    wifipassword5: null,
    wifipassword6: null,
    wifipassword7: null,
    wifipassword8: null,
    wifipassword9: null,
    wifipassword10: null,

    // switch

    switchUART0: true,
    switchUART1: true,
    switchUART2: true,
    switchI2C0: true,
    switchI2C1: true,
    switchHSSPI0: true,
    switchLSSPI0: true,
    switchWiFi0: true,
    switchWiFiSmart0: false,
  };

  handleUARTSwitchChange = (nr) => {
    let switchNumber = `switchUART${nr}`;
    this.setState({
      [switchNumber]: !this.state[switchNumber],
    });
  };

  handleI2CSwitchChange = (nr) => () => {
    let switchNumber = `switchI2C${nr}`;
    this.setState({
      [switchNumber]: !this.state[switchNumber],
    });
  };

  handleWiFiSwitchChange = (nr) => () => {
    let switchNumber = `switchWiFi${nr}`;
    this.setState({
      [switchNumber]: !this.state[switchNumber],
    });
  };
  handleWiFiSmartSwitchChange = (nr) => () => {
    let switchNumber = `switchWiFiSmart${nr}`;
    this.setState({
      [switchNumber]: !this.state[switchNumber],
    });
  };

  // switch (event.) {
  //   case "switchUART":
  //     let switchNumber = `switchUART${nr}`;
  //     this.setState({
  //       [switchNumber]: !this.state[switchNumber],
  //     });
  //     // console.log("switchNumber :", switchNumber);
  //     // console.log("switchUART0 :", this.switchUART0);
  //     break;
  // case "switchI2C":
  //   let switchNumber = `switchI2C${nr}`;
  //   this.setState({
  //     [switchNumber]: !this.state[switchNumber],
  //   });
  // break;
  // case "switchWiFi":
  //   let switchNumber = `switchWiFi${nr}`;
  //   this.setState({
  //     [switchNumber]: !this.state[switchNumber],
  //   });
  // break;

  // let switchNumber = `switchUART${nr}`;
  // this.setState({
  //   [switchNumber]: !this.state[switchNumber],
  // });

  menuOpenHandler = (value) => {
    console.log("menuOpenHandler");
  };

  menuSelectHandler = (info) => {
    console.log(`menuSelectHandler key ${info.key}`);
    console.log(`menuSelectHandler info ${info}`);
    this.setState(
      {
        selectedItem: info.key,
      },
      function () {
        console.log(this.state.selectedItem);
      }
    );

    switch (info.key) {
      case "1-1":
        this.setState({
          pageStatus: "device-properties",
        });
        break;
      case "2-1":
        this.setState({
          pageStatus: "UART",
        });
        break;
      case "2-2":
        this.setState({
          pageStatus: "I2C",
        });
        break;
      case "2-3":
        this.setState({
          pageStatus: "WIFI",
        });
        break;
      case "4":
        this.setState({
          pageStatus: "Error-Policy",
        });
        break;
    }
  };

  /////////////////////////////Button handler//////////////////////////////////
  saveButtonHandler = () => {
    this.setState({
      pageStatus: "main-menu",
    });
  };

  backButtonHandler = () => {
    this.setState({
      pageStatus: "main-menu",
    });
  };

  //////////////////Error policy///////////////////////////////////////////

  errorParameterSelectEventHandle = (event) => {
    switch (event.target.value) {
      case "NONE":
        this.setState({
          errorSelectedParamter: "NONE",
        });
        break;
      case "Exception":
        this.setState({
          errorSelectedParamter: "Exception",
        });
        break;
      case "Major Error":
        this.setState({
          errorSelectedParamter: "Major Error",
        });
        break;
      case "Minor Error":
        this.setState({
          errorSelectedParamter: "Minor Error",
        });
        break;
      case "Major Warning":
        this.setState({
          errorSelectedParamter: "Major Warning",
        });
        break;
      case "Minor Warning":
        this.setState({
          errorSelectedParamter: "Minor Warning",
        });
        break;
    }
  };

  errorDisplayParameterSelectEventHandle = (event) => {
    switch (event.target.value) {
      case "NONE":
        this.setState({
          errorDisplaySelectedParamter: "NONE",
        });
        break;
      case "TURN LED ON":
        this.setState({
          errorDisplaySelectedParamter: "TURN LED ON",
        });
        break;
      case "TURN LED OFF":
        this.setState({
          errorDisplaySelectedParamter: "TURN LED OFF",
        });
        break;
      case "TOGGLE LED 1HZ":
        this.setState({
          errorDisplaySelectedParamter: "TOGGLE LED 1HZ",
        });
        break;
      case "TOGGLE LED 2HZ":
        this.setState({
          errorDisplaySelectedParamter: "TOGGLE LED 2HZ",
        });
        break;
      case "TOGGLE LED 4HZ":
        this.setState({
          errorDisplaySelectedParamter: "TOGGLE LED 4HZ",
        });
        break;
      case "TOGGLE LED RED":
        this.setState({
          errorDisplaySelectedParamter: "TOGGLE LED RED",
        });
        break;

      case "TOGGLE LED GREEN":
        this.setState({
          errorDisplaySelectedParamter: "GREEN",
        });
        break;
      case "TOGGLE LED BLUE":
        this.setState({
          errorDisplaySelectedParamter: "BLUE",
        });
        break;
      case "SEND ERROR MESSAGE VIA MQTT":
        this.setState({
          errorDisplaySelectedParamter: "SEND ERROR MESSAGE VIA MQTT",
        });
        break;
      case "SEND ERROR MESSAGE VIA TCP":
        this.setState({
          errorDisplaySelectedParamter: "SEND ERROR MESSAGE VIA TCP",
        });
        break;
      case "SEND ERROR MESSAGE VIA WS":
        this.setState({
          errorDisplaySelectedParamter: "SEND ERROR MESSAGE VIA WS",
        });
        break;
      case "SEND ERROR MESSAGE VIA BLE":
        this.setState({
          errorDisplaySelectedParamter: "SEND ERROR MESSAGE VIA BLE",
        });
        break;
      case "SEND ERROR MESSAGE VIA UART0":
        this.setState({
          errorDisplaySelectedParamter: "SEND ERROR MESSAGE VIA UART0",
        });
        break;
      case "SEND ERROR MESSAGE VIA I2C0":
        this.setState({
          errorDisplaySelectedParamter: "SEND ERROR MESSAGE VIA I2C0",
        });
        break;
    }
  };

  ////////////////////////Communication protocol UART, I2C /////////////////////////////////////////////////////////

  Comm_Protocol_BaudRate_SelectEventHandle = (event) => {
    switch (event.target.value) {
      case "uart0baud115200":
        this.setState({
          uart0baud: "115200",
        });
        break;
      case "uart0baud9600":
        this.setState({
          uart0baud: "9600",
        });
      case "uart1baud115200":
        this.setState({
          uart1baud: "115200",
        });
        break;
      case "uart1baud9600":
        this.setState({
          uart1baud: "9600",
        });
      case "uart2baud115200":
        this.setState({
          uart2baud: "115200",
        });
        break;
      case "uart2baud9600":
        this.setState({
          uart2baud: "9600",
        });
        break;
    }
  };

  Comm_Protocol_ParameterSelectEventHandle = (event) => {
    switch (event.target.value) {
      case "Uart0Enable":
        this.setState({
          Uart0selectedParamter: "Enable",
        });
        break;
      case "Uart0Disable":
        this.setState({
          Uart0selectedParamter: "Disable",
        });
        break;
      case "Uart1Enable":
        this.setState({
          Uart1selectedParamter: "Enable",
        });
        break;
      case "Uart1Disable":
        this.setState({
          Uart1selectedParamter: "Disable",
        });
        break;
      case "Uart2Enable":
        this.setState({
          Uart2selectedParamter: "Enable",
        });
        break;
      case "Uart2Disable":
        this.setState({
          Uart2selectedParamter: "Disable",
        });
        break;
      case "I2C0Enable":
        this.setState({
          I2C0selectedParamter: "Enable",
        });
        break;
      case "I2C0Disable":
        this.setState({
          I2C0selectedParamter: "Disable",
        });
        break;
      case "I2C1Enable":
        this.setState({
          I2C1selectedParamter: "Enable",
        });
        break;
      case "I2C1Disable":
        this.setState({
          I2C1selectedParamter: "Disable",
        });
        break;
      case "I2C2Enable":
        this.setState({
          I2C2selectedParamter: "Enable",
        });
        break;
      case "I2C2Disable":
        this.setState({
          I2C2selectedParamter: "Disable",
        });
        break;
      case "WiFiEnable":
        this.setState({
          WiFiselectedParamter: "Enable",
        });
        break;
      case "WiFiDisable":
        this.setState({
          WiFiselectedParamter: "Disable",
        });
        break;
      case "WiFiSmartEnable":
        this.setState({
          WiFiSmartSelectedParamter: "Enable",
        });
        break;
      case "WiFiSmartDisable":
        this.setState({
          WiFiSmartSelectedParamter: "Disable",
        });
        break;
    }
  };

  Comm_Protocol_Freq_SelectEventHandle = (event) => {
    switch (event.target.value) {
      case "i2c0freq50000":
        this.setState({
          i2c0freq: "50000",
        });
        break;
      case "i2c1freq50000":
        this.setState({
          i2c1freq: "50000",
        });
      case "i2c2freq50000":
        this.setState({
          i2c2freq: "50000",
        });
        break;
    }
  };

  // WIFI

  WifiNetworkSelectEventHandle = (event) => {
    switch (event.target.value) {
      case "WiFi1":
        this.setState({
          WiFiNetworkNumber: "WiFi1",
        });
        break;
      case "WiFi2":
        this.setState({
          WiFiNetworkNumber: "WiFi2",
        });
        break;
      case "WiFi3":
        this.setState({
          WiFiNetworkNumber: "WiFi3",
        });
        break;
      case "WiFi4":
        this.setState({
          WiFiNetworkNumber: "WiFi4",
        });
        break;
      case "WiFi5":
        this.setState({
          WiFiNetworkNumber: "WiFi5",
        });
        break;
      case "WiFi6":
        this.setState({
          WiFiNetworkNumber: "WiFi6",
        });
        break;
      case "WiFi7":
        this.setState({
          WiFiNetworkNumber: "WiFi7",
        });
        break;
      case "WiFi8":
        this.setState({
          WiFiNetworkNumber: "WiFi8",
        });
        break;
      case "WiFi9":
        this.setState({
          WiFiNetworkNumber: "WiFi9",
        });
        break;
      case "WiFi10":
        this.setState({
          WiFiNetworkNumber: "WiFi10",
        });
        break;
      default:
        return "WiFi10";
    }
  };

  WiFi_ReconnectAttempt_SelectEventHandle = (event) => {
    switch (event.target.value) {
      case "attempt5":
        this.setState({
          wifiReconnectAttempt: "5",
        });
        break;
      case "attempt10":
        this.setState({
          wifiReconnectAttempt: "10",
        });
    }
  };

  WiFiSSIDChangeHandler = (event) => {
    switch (event.target.value) {
      case "wifissid1":
        this.setState({
          wifissid1: event.target.value,
        });
        break;
      case "wifissid2":
        this.setState({
          wifissid2: event.target.value,
        });
        break;
      case "wifissid3":
        this.setState({
          wifissid3: event.target.value,
        });
        break;
      case "wifissid4":
        this.setState({
          wifissid4: event.target.value,
        });
        break;
      case "wifissid5":
        this.setState({
          wifissid5: event.target.value,
        });
        break;
      case "wifissid6":
        this.setState({
          wifissid6: event.target.value,
        });
        break;
      case "wifissid7":
        this.setState({
          wifissid7: event.target.value,
        });
        break;
      case "wifissid8":
        this.setState({
          wifissid8: event.target.value,
        });
        break;
      case "wifissi91":
        this.setState({
          wifissid1: event.target.value,
        });
        break;
      case "wifissid10":
        this.setState({
          wifissid2: event.target.value,
        });
        break;
      default:
        return "wifissid1";

      // this.setState({
      //   wifissid: event.target.value,
      // });
    }
  };
  WiFiPasswordChangeHandler = (event) => {
    switch (event.target.value) {
      case "wifipassword1":
        this.setState({
          wifissid1: event.target.value,
        });
        break;
      case "wifipassword2":
        this.setState({
          wifissid2: event.target.value,
        });
        break;
      case "wifipassword3":
        this.setState({
          wifissid3: event.target.value,
        });
        break;
      case "wifipassword4":
        this.setState({
          wifissid4: event.target.value,
        });
        break;
      case "wifipassword5":
        this.setState({
          wifissid5: event.target.value,
        });
        break;
      case "wifipassword6":
        this.setState({
          wifissid6: event.target.value,
        });
        break;
      case "wifipassword7":
        this.setState({
          wifissid7: event.target.value,
        });
        break;
      case "wifipassword8":
        this.setState({
          wifissid8: event.target.value,
        });
        break;
      case "wifipassword9":
        this.setState({
          wifissid1: event.target.value,
        });
        break;
      case "wifipassword10":
        this.setState({
          wifissid2: event.target.value,
        });
        break;
      default:
        return "wifipassword1";

      // this.setState({
      //   wifipassword: event.target.value,
      // });
    }
  };
  /////////////////////////////////////////////////////////////////////
  render() {
    const { triggerSubMenuAction } = this.props;
    const { children, overflowedIndicator } = this.state;

    ////////////////////Error policy///////////////////////////////
    const ErrorConfigParameterOption = [
      { NONE: "/uptime/sense/device/config/system/error-policy/none" },
      {
        Exception: "/uptime/sense/device/config/system/error-policy/exception",
      },
      {
        "Major Error":
          "/uptime/sense/device/config/system/error-policy/Major-Error",
      },
      {
        "Minor Error":
          "/uptime/sense/device/config/system/error-policy/Minor Error",
      },
      {
        "Major Warning":
          "/uptime/sense/device/config/system/error-policy/Major Warning",
      },
      {
        "Minor Warning":
          "/uptime/sense/device/config/system/error-policy/Minor Warning",
      },
    ];

    const ErrorDisplayConfigParameterOption = [
      { NONE: "/uptime/sense/device/config/system/error-policy/none" },
      {
        "TURN LED ON":
          "/uptime/sense/device/config/system/error-policy/TURN LED ON",
      },
      {
        "TURN LED OFF":
          "/uptime/sense/device/config/system/error-policy/TURN LED OFF",
      },
      {
        "TOGGLE LED 1HZ":
          "/uptime/sense/device/config/system/error-policy/TOGGLE LED 1HZ",
      },
      {
        "TOGGLE LED 2HZ":
          "/uptime/sense/device/config/system/error-policy/TOGGLE LED 2HZ",
      },
      {
        "TOGGLE LED 4HZ":
          "/uptime/sense/device/config/system/error-policy/TOGGLE LED 4HZ",
      },
      {
        "TOGGLE LED RED":
          "/uptime/sense/device/config/system/error-policy/TOGGLE LED RED",
      },
      {
        "TOGGLE LED BLUE":
          "/uptime/sense/device/config/system/error-policy/TOGGLE LED BLUE",
      },
      {
        "SEND ERROR MESSAGE VIA MQTT":
          "/uptime/sense/device/config/system/error-policy/SEND ERROR MESSAGE VIA MQTT",
      },
      {
        "SEND ERROR MESSAGE VIA TCP":
          "/uptime/sense/device/config/system/error-policy/SEND ERROR MESSAGE VIA TCP",
      },
      {
        "SEND ERROR MESSAGE VIA WS":
          "/uptime/sense/device/config/system/error-policy/SEND ERROR MESSAGE VIA WS",
      },
      {
        "SEND ERROR MESSAGE VIA BLE":
          "/uptime/sense/device/config/system/error-policy/SEND SEND ERROR MESSAGE VIA BLE",
      },
      {
        "SEND ERROR MESSAGE VIA UART0":
          "/uptime/sense/device/config/system/error-policy/SEND ERROR MESSAGE VIA UART0",
      },
      {
        "SEND ERROR MESSAGE VIA I2C0":
          "/uptime/sense/device/config/system/error-policy/SEND ERROR MESSAGE VIA I2C0",
      },
    ];

    ////////////////// Comm. Protocol/////////////////////////////////////

    const EnableDisableconfigParameterOption = [
      {
        Enable:
          "/uptime/sense/device/config/system/communication-protocol/enable",
      },
      {
        Disable:
          "/uptime/sense/device/config/system/communication-protocol/disable",
      },
    ];

    const BaudRateConfigParameterOption = [
      {
        115200: "/uptime/sense/device/config/system/communication-protocol/baudrate/115200",
      },
      {
        9600: "/uptime/sense/device/config/system/communication-protocol/baudrate/115200",
      },
    ];

    const FreqencyConfigParameterOption = [
      {
        50000: "/uptime/sense/device/config/system/communication-protocol/frequency",
      },
    ];

    const WiFiConfigParameterOption = [
      {
        10: "/uptime/sense/device/config/system/communication-protocol/wifi/reconnect-attempt/10",
      },
      {
        5: "/uptime/sense/device/config/system/communication-protocol/wifi/reconnect-attempt/5",
      },
    ];

    const WiFiNetworkParameterOption = [
      {
        WiFi1:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi1",
      },
      {
        WiFi2:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi2",
      },
      {
        WiFi3:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi3",
      },
      {
        WiFi4:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi4",
      },
      {
        WiFi5:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi5",
      },
      {
        WiFi6:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi6",
      },
      {
        WiFi7:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi7",
      },
      {
        WiFi8:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi8",
      },
      {
        WiFi9:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi9",
      },
      {
        WiFi10:
          "/uptime/sense/device/config/system/communication-protocol/wifi/wifi10",
      },
    ];

    /////////////////////////////////////////////////////////////////////////

    switch (this.state.pageStatus) {
      case "main-menu":
        return (
          <div>
            <Row>
              <Col sm lg="4">
                <Menu
                  onClick={this.menuSelectHandler}
                  triggerSubMenuAction={triggerSubMenuAction}
                  onOpenChange={this.menuOpenHandler}
                  selectedKeys={["3"]}
                  mode={this.props.mode}
                  openAnimation={this.props.openAnimation}
                  defaultOpenKeys={this.props.defaultOpenKeys}
                  overflowedIndicator={overflowedIndicator}
                >
                  {children}
                </Menu>
              </Col>
            </Row>
          </div>
        );
        break;

      case "device-properties":
        return (
          <div>
            <div className="Title20">Device Properties</div>
            <div className="mt-5"> </div>

            <ListGroup>
              <ListGroup.Item>Device Type : </ListGroup.Item>
              <ListGroup.Item> Device UUID :</ListGroup.Item>
              <ListGroup.Item>Device Description :</ListGroup.Item>
            </ListGroup>

            <Row className="Paragraph16">
              <Col sm="4">
                <Button className="Button" onClick={this.backButtonHandler}>
                  Back
                </Button>
                {/* <Button className="Button" onClick={this.saveButtonHandler}>
                  Save
                </Button> */}
              </Col>
            </Row>
          </div>
        );
        break;

      case "UART":
        return (
          <div>
            <div className="Title20">UART PROTOCOL</div>
            <div className="mt-5"> </div>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Check
                    type="switch"
                    id="custom-switch 0"
                    label="Enable UART0"
                    checked={this.state.switchUART0}
                    onClick={() => this.handleUARTSwitchChange(0)}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Check
                    type="switch"
                    id="custom-switch 1"
                    label="Enable UART1"
                    checked={this.state.switchUART1}
                    onClick={() => this.handleUARTSwitchChange(1)}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Check
                    type="switch"
                    id="custom-switch 2"
                    label="Enable UART2"
                    checked={this.state.switchUART2}
                    onChange={() => this.handleUARTSwitchChange(2)}
                  />
                </Form.Group>
              </Form.Row>

              <div className="mt-4"> </div>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>UART0 Baud Rate</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.Comm_Protocol_BaudRate_SelectEventHandle}
                  >
                    {BaudRateConfigParameterOption.map((item, index) => {
                      return <option>{Object.keys(item)}</option>;
                    })}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>UART1 Baud Rate</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.Comm_Protocol_BaudRate_SelectEventHandle}
                  >
                    {BaudRateConfigParameterOption.map((item, index) => {
                      return <option>{Object.keys(item)}</option>;
                    })}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>UART2 Baud Rate</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.Comm_Protocol_BaudRate_SelectEventHandle}
                  >
                    {BaudRateConfigParameterOption.map((item, index) => {
                      return <option>{Object.keys(item)}</option>;
                    })}
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row className="Paragraph16">
                <Col sm="4">
                  <Button className="Button" onClick={this.backButtonHandler}>
                    Back
                  </Button>
                  <Button className="Button" onClick={this.saveButtonHandler}>
                    Save
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </div>
        );
        break;

      case "I2C":
        return (
          <div>
            <div className="Title20">I2C PROTOCOL</div>
            <div className="mt-5"> </div>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Enable I2C0"
                    checked={this.state.switchI2C0}
                    onChange={this.handleI2CSwitchChange(0)}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Enable I2C1"
                    checked={this.state.switchI2C1}
                    onChange={this.handleI2CSwitchChange(1)}
                  />
                </Form.Group>
              </Form.Row>

              <div className="mt-4"> </div>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>I2C0 Frequency</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.Comm_Protocol_Freq_SelectEventHandle}
                  >
                    {FreqencyConfigParameterOption.map((item, index) => {
                      return <option>{Object.keys(item)}</option>;
                    })}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>I2C1 Frequency</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.Comm_Protocol_Freq_SelectEventHandle}
                  >
                    {FreqencyConfigParameterOption.map((item, index) => {
                      return <option>{Object.keys(item)}</option>;
                    })}
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row className="Paragraph16">
                <Col sm="4">
                  <Button className="Button" onClick={this.backButtonHandler}>
                    Back
                  </Button>
                  <Button className="Button" onClick={this.saveButtonHandler}>
                    Save
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </div>
        );

        break;
      case "WIFI":
        return (
          <div>
            <div className="Title20">WiFi PROTOCOL</div>
            <div className="mt-5"> </div>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Enable WiFi"
                  checked={this.state.switchWiFi0}
                  onChange={this.handleWiFiSwitchChange(0)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Enable WiFi Smart Connect"
                  checked={this.state.switchWiFiSmart0}
                  onChange={this.handleWiFiSmartSwitchChange(0)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Col sm="7">
                  <Form.Label>WiFi Reconnect Attempt</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.WiFi_ReconnectAttempt_SelectEventHandle}
                  >
                    {WiFiConfigParameterOption.map((item, index) => {
                      return <option>{Object.keys(item)}</option>;
                    })}
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form.Row>

            <div className="mt-4"> </div>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridState">
                <Col sm="7">
                  <Form.Label>Choose WiFi</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.WifiNetworkSelectEventHandle}
                  >
                    {WiFiNetworkParameterOption.map((item, index) => {
                      return <option>{Object.keys(item)}</option>;
                    })}
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Col sm="10">
                  <Form.Label>WiFi Network</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter WiFi SSID"
                    maxLength="20"
                    required={true}
                    onChange={this.WiFiSSIDChangeHandler}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Col sm="10">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter WiFi Password"
                    maxLength="20"
                    required={true}
                    onChange={this.WiFiPasswordChangeHandler}
                  />
                </Col>
              </Form.Group>
            </Form.Row>
            <Form.Row className="Paragraph16">
              <Col sm="4">
                <Button className="Button" onClick={this.backButtonHandler}>
                  Back
                </Button>
                <Button className="Button" onClick={this.saveButtonHandler}>
                  Save
                </Button>
              </Col>
            </Form.Row>
          </div>
        );
        break;

      case "Error-Policy":
        return (
          <div>
            <div className="Title20">Error Policy</div>

            <div className="FormGroup">
              <Form.Group controlId="formDeviceProperties">
                <Row className="Paragraph16">
                  <Col sm="7">
                    <Form.Label>Select Error Policy</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={this.errorParameterSelectEventHandle}
                    >
                      {ErrorConfigParameterOption.map((item, index) => {
                        return <option>{Object.keys(item)}</option>;
                      })}
                    </Form.Control>
                  </Col>
                </Row>

                <br />
                <Row className="Paragraph16">
                  <Col sm="7">
                    <Form.Label>Select Error Display Method</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={this.errorDisplayParameterSelectEventHandle}
                    >
                      {ErrorDisplayConfigParameterOption.map((item, index) => {
                        return <option>{Object.keys(item)}</option>;
                      })}
                    </Form.Control>
                  </Col>
                </Row>
                <Row className="Paragraph16">
                  <Col sm="4">
                    <Button className="Button" onClick={this.backButtonHandler}>
                      Back
                    </Button>
                    <Button className="Button" onClick={this.saveButtonHandler}>
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </div>
          </div>
        );
        break;
    }
  }
}
export default NestedSelectMenu;

NestedSelectMenu.propTypes = {
  mode: PropTypes.string,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  triggerSubMenuAction: PropTypes.string,
  defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
  // updateChildrenAndOverflowedIndicator: PropTypes.bool,
};
