import React, { Component } from "react";
import PropTypes from "prop-types";
import Menu, { SubMenu, Item as MenuItem } from "rc-menu";
import "rc-menu/assets/index.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "./ProtocolConfigPage.css";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import { connect } from "react-redux";

const children1 = [
  <MenuItem key="1">MQTT Client</MenuItem>,
  <MenuItem key="6">Influx DB Client</MenuItem>,

  <SubMenu
    title={<span className="submenu-title-wrapper">BLE Client</span>}
    key="2"
  >
    <MenuItem key="2-1">BLE Client 0</MenuItem>
    <MenuItem key="2-2">BLE Client 1</MenuItem>
    <MenuItem key="2-3">BLE Client 2</MenuItem>
    <MenuItem key="2-4">BLE Client 3</MenuItem>
    <MenuItem key="2-5">BLE Client 4</MenuItem>
    <MenuItem key="2-6">BLE Client 5</MenuItem>
    <MenuItem key="2-7">BLE Client 6</MenuItem>
    <MenuItem key="2-8">BLE Client 7</MenuItem>
  </SubMenu>,

  <MenuItem key="5">BLE Server</MenuItem>,
];

const MQTTclientQOS_ParameterOption = ["0", "1", "2"];

const BLEclient_ParameterOption = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
];

const BLEclient_AddressType = ["Public", "Random", "RPA Public", "RPA Random"];
///////////////// class///////////////////////////////////////////

class ProtocolConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: children1,
      overflowedIndicator: undefined,
      selectedItem: null,
      pageStatus: "main-menu",
      onSaveAlert: false,
      protocol_configuration: {
        operation: "protocol",
        device_id: this.props.location.state.deviceid,
        file_type: "protocol",
        // MQTT CLIENT
        mqttc_en: false,
        mqttb_uri: "",
        mqttb_port: "1886",
        mqttc_keep_alive_timeout: "1000",
        mqttc_qos: "1",
        mqttc_enable_clean_session: true,
        mqttc_enable_auto_reconnect: true,
        mqttc_last_will_topic: "",
        mqttc_last_will_msg: "",
        //iNFLUX DB CLIENT
        influxc_host: "",
        influxc_port: "8086",
        influxc_db_name: "",
        influxc_usr_name: "",
        influxc_password: "",
        //BLE CLIENT UART
        ble_client0_en: false,
        ble_client0_name: "",
        ble_client0_max_device_to_scan: "1",
        ble_client0_service_uuid: "",
        ble_client0_tx_uuid: "",
        ble_client0_rx_uuid: "",
        ble_client0_bonded_dev_address: "",
        ble_client0_bonded_dev_address_type: "",

        ble_client1_en: false,
        ble_client1_name: "",
        ble_client1_max_device_to_scan: "1",
        ble_client1_service_uuid: "",
        ble_client1_tx_uuid: "",
        ble_client1_rx_uuid: "",
        ble_client1_bonded_dev_address: "",
        ble_client1_bonded_dev_address_type: BLEclient_AddressType[0],

        ble_client2_en: false,
        ble_client2_name: "",
        ble_client2_max_device_to_scan: "1",
        ble_client2_service_uuid: "",
        ble_client2_tx_uuid: "",
        ble_client2_rx_uuid: "",
        ble_client2_bonded_dev_address: "",
        ble_client2_bonded_dev_address_type: BLEclient_AddressType[0],

        ble_client3_en: false,
        ble_client3_name: "",
        ble_client3_max_device_to_scan: "1",
        ble_client3_service_uuid: "",
        ble_client3_tx_uuid: "",
        ble_client3_rx_uuid: "",
        ble_client3_bonded_dev_address: "",
        ble_client3_bonded_dev_address_type: BLEclient_AddressType[0],

        ble_client4_en: false,
        ble_client4_name: "",
        ble_client4_max_device_to_scan: "1",
        ble_client4_service_uuid: "",
        ble_client4_tx_uuid: "",
        ble_client4_rx_uuid: "",
        ble_client4_bonded_dev_address: "",
        ble_client4_bonded_dev_address_type: BLEclient_AddressType[0],

        ble_client5_en: false,
        ble_client5_name: "",
        ble_client5_max_device_to_scan: "1",
        ble_client5_service_uuid: "",
        ble_client5_tx_uuid: "",
        ble_client5_rx_uuid: "",
        ble_client5_bonded_dev_address: "",
        ble_client5_bonded_dev_address_type: BLEclient_AddressType[0],

        ble_client6_en: false,
        ble_client6_name: "",
        ble_client6_max_device_to_scan: "1",
        ble_client6_service_uuid: "",
        ble_client6_tx_uuid: "",
        ble_client6_rx_uuid: "",
        ble_client6_bonded_dev_address: "",
        ble_client6_bonded_dev_address_type: BLEclient_AddressType[0],

        ble_client7_en: false,
        ble_client7_name: "",
        ble_client7_max_device_to_scan: "1",
        ble_client7_service_uuid: "",
        ble_client7_tx_uuid: "",
        ble_client7_rx_uuid: "",
        ble_client7_bonded_dev_address: "",
        ble_client7_bonded_dev_address_type: BLEclient_AddressType[0],
        // BLE SERVER UART
        ble_server_en: false,
        ble_server_name: "",
        ble_server_service_uuid: "",
        ble_server_tx_uuid: "",
        ble_server_rx_uuid: "",
        ble_server_dev_address: "",
        ble_server_dev_address_type: BLEclient_AddressType[0],
      },
    };
  }

  /////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    const data = {
      operation: "protocol",
      device_id: this.state.protocol_configuration.device_id,
    };
    axios
      .get(this.props.server_address + "/uptime/sense/device/config", {
        params: data,
      })
      .then((response) => {
        // console.log(response.data);
        let temp = { ...this.state.protocol_configuration };

        (temp.device_id = response.data["device_id"]),
          (temp.file_type = response.data["file_type"]),
          // MQTT CLIENT
          (temp.mqttc_en = response.data["mqttc_en"]),
          (temp.mqttb_uri = response.data["mqttb_uri"]),
          (temp.mqttb_port = response.data["mqttb_port"]),
          (temp.mqttc_keep_alive_timeout =
            response.data["mqttc_keep_alive_timeout"]),
          (temp.mqttc_qos = response.data["mqttc_qos"]),
          (temp.mqttc_enable_clean_session =
            response.data["mqttc_enable_clean_session"]),
          (temp.mqttc_enable_auto_reconnect =
            response.data["mqttc_enable_auto_reconnect"]),
          (temp.mqttc_last_will_topic = response.data["mqttc_last_will_topic"]),
          (temp.mqttc_last_will_msg = response.data["mqttc_last_will_msg"]),
          //iNFLUX DB CLIENT
          (temp.influxc_host = response.data["influxc_host"]),
          (temp.influxc_port = response.data["influxc_port"]),
          (temp.influxc_db_name = response.data["influxc_db_name"]),
          (temp.influxc_usr_name = response.data["influxc_usr_name"]),
          (temp.influxc_password = response.data["influxc_password"]),
          //BLE CLIENT UART0
          (temp.ble_client0_en = response.data["ble_client0_en"]),
          (temp.ble_client0_name = response.data["ble_client0_name"]),
          (temp.ble_client0_max_device_to_scan =
            response.data["ble_client0_max_device_to_scan"]),
          (temp.ble_client0_service_uuid =
            response.data["ble_client0_service_uuid"]),
          (temp.ble_client0_tx_uuid = response.data["ble_client0_tx_uuid"]),
          (temp.ble_client0_rx_uuid = response.data["ble_client0_rx_uuid"]),
          (temp.ble_client0_bonded_dev_address =
            response.data["ble_client0_bonded_dev_address"]),
          (temp.ble_client0_bonded_dev_address_type =
            response.data["ble_client0_bonded_dev_address_type"]),
          //BLE CLIENT UART1
          (temp.ble_client1_en = response.data["ble_client1_en"]),
          (temp.ble_client1_name = response.data["ble_client1_name"]),
          (temp.ble_client1_max_device_to_scan =
            response.data["ble_client1_max_device_to_scan"]),
          (temp.ble_client1_service_uuid =
            response.data["ble_client1_service_uuid"]),
          (temp.ble_client1_tx_uuid = response.data["ble_client1_tx_uuid"]),
          (temp.ble_client1_rx_uuid = response.data["ble_client1_rx_uuid"]),
          (temp.ble_client1_bonded_dev_address =
            response.data["ble_client1_bonded_dev_address"]),
          (temp.ble_client1_bonded_dev_address_type =
            response.data["ble_client1_bonded_dev_address_type"]),
          //BLE CLIENT UART2
          (temp.ble_client2_en = response.data["ble_client2_en"]),
          (temp.ble_client2_name = response.data["ble_client2_name"]),
          (temp.ble_client2_max_device_to_scan =
            response.data["ble_client2_max_device_to_scan"]),
          (temp.ble_client2_service_uuid =
            response.data["ble_client2_service_uuid"]),
          (temp.ble_client2_tx_uuid = response.data["ble_client2_tx_uuid"]),
          (temp.ble_client2_rx_uuid = response.data["ble_client2_rx_uuid"]),
          (temp.ble_client2_bonded_dev_address =
            response.data["ble_client2_bonded_dev_address"]),
          (temp.ble_client2_bonded_dev_address_type =
            response.data["ble_client2_bonded_dev_address_type"]),
          //BLE CLIENT UART3
          (temp.ble_client3_en = response.data["ble_client3_en"]),
          (temp.ble_client3_name = response.data["ble_client3_name"]),
          (temp.ble_client3_max_device_to_scan =
            response.data["ble_client3_max_device_to_scan"]),
          (temp.ble_client3_service_uuid =
            response.data["ble_client3_service_uuid"]),
          (temp.ble_client3_tx_uuid = response.data["ble_client3_tx_uuid"]),
          (temp.ble_client3_rx_uuid = response.data["ble_client3_rx_uuid"]),
          (temp.ble_client3_bonded_dev_address =
            response.data["ble_client3_bonded_dev_address"]),
          (temp.ble_client3_bonded_dev_address_type =
            response.data["ble_client3_bonded_dev_address_type"]),
          //BLE CLIENT UART4
          (temp.ble_client4_en = response.data["ble_client4_en"]),
          (temp.ble_client4_name = response.data["ble_client4_name"]),
          (temp.ble_client4_max_device_to_scan =
            response.data["ble_client4_max_device_to_scan"]),
          (temp.ble_client4_service_uuid =
            response.data["ble_client4_service_uuid"]),
          (temp.ble_client4_tx_uuid = response.data["ble_client4_tx_uuid"]),
          (temp.ble_client4_rx_uuid = response.data["ble_client4_rx_uuid"]),
          (temp.ble_client4_bonded_dev_address =
            response.data["ble_client4_bonded_dev_address"]),
          (temp.ble_client4_bonded_dev_address_type =
            response.data["ble_client4_bonded_dev_address_type"]),
          //BLE CLIENT UART5
          (temp.ble_client5_en = response.data["ble_client5_en"]),
          (temp.ble_client5_name = response.data["ble_client5_name"]),
          (temp.ble_client5_max_device_to_scan =
            response.data["ble_client5_max_device_to_scan"]),
          (temp.ble_client5_service_uuid =
            response.data["ble_client5_service_uuid"]),
          (temp.ble_client5_tx_uuid = response.data["ble_client5_tx_uuid"]),
          (temp.ble_client5_rx_uuid = response.data["ble_client5_rx_uuid"]),
          (temp.ble_client5_bonded_dev_address =
            response.data["ble_client5_bonded_dev_address"]),
          (temp.ble_client5_bonded_dev_address_type =
            response.data["ble_client5_bonded_dev_address_type"]),
          //BLE CLIENT UART6
          (temp.ble_client6_en = response.data["ble_client6_en"]),
          (temp.ble_client6_name = response.data["ble_client6_name"]),
          (temp.ble_client6_max_device_to_scan =
            response.data["ble_client6_max_device_to_scan"]),
          (temp.ble_client6_service_uuid =
            response.data["ble_client6_service_uuid"]),
          (temp.ble_client6_tx_uuid = response.data["ble_client6_tx_uuid"]),
          (temp.ble_client6_rx_uuid = response.data["ble_client6_rx_uuid"]),
          (temp.ble_client6_bonded_dev_address =
            response.data["ble_client6_bonded_dev_address"]),
          (temp.ble_client6_bonded_dev_address_type =
            response.data["ble_client6_bonded_dev_address_type"]),
          //BLE CLIENT UART7
          (temp.ble_client7_en = response.data["ble_client7_en"]),
          (temp.ble_client7_name = response.data["ble_client7_name"]),
          (temp.ble_client7_max_device_to_scan =
            response.data["ble_client7_max_device_to_scan"]),
          (temp.ble_client7_service_uuid =
            response.data["ble_client7_service_uuid"]),
          (temp.ble_client7_tx_uuid = response.data["ble_client7_tx_uuid"]),
          (temp.ble_client7_rx_uuid = response.data["ble_client7_rx_uuid"]),
          (temp.ble_client7_bonded_dev_address =
            response.data["ble_client7_bonded_dev_address"]),
          (temp.ble_client7_bonded_dev_address_type =
            response.data["ble_client7_bonded_dev_address_type"]),
          // BLE SERVER UART
          (temp.ble_server_en = response.data["ble_server_en"]),
          (temp.ble_server_name = response.data["ble_server_name"]),
          (temp.ble_server_service_uuid =
            response.data["ble_server_service_uuid"]),
          (temp.ble_server_tx_uuid = response.data["ble_server_tx_uuid"]),
          (temp.ble_server_rx_uuid = response.data["ble_server_rx_uuid"]),
          (temp.ble_server_dev_address =
            response.data["ble_server_dev_address"]),
          (temp.ble_server_dev_address_type =
            response.data["ble_server_dev_address_type"]),
          this.setState({
            protocol_configuration: temp,
          });
      });
  }

  menuOpenHandler = (value) => {
    console.log("menuOpenHandler");
  };

  //========== menu select handler ===========
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
      case "1":
        this.setState({
          pageStatus: "MQTT Client",
        });
        break;

      case "2-1":
        this.setState({
          pageStatus: "BLE Client 0",
        });
        break;
      case "2-2":
        this.setState({
          pageStatus: "BLE Client 1",
        });
        break;
      case "2-3":
        this.setState({
          pageStatus: "BLE Client 2",
        });
        break;
      case "2-4":
        this.setState({
          pageStatus: "BLE Client 3",
        });
        break;
      case "2-5":
        this.setState({
          pageStatus: "BLE Client 4",
        });
        break;
      case "2-6":
        this.setState({
          pageStatus: "BLE Client 5",
        });
        break;
      case "2-7":
        this.setState({
          pageStatus: "BLE Client 6",
        });
        break;
      case "2-8":
        this.setState({
          pageStatus: "BLE Client 7",
        });
        break;

      case "5":
        this.setState({
          pageStatus: "BLE Server",
        });
        break;
      case "6":
        this.setState({
          pageStatus: "Influx DB Client",
        });
    }
  };

  /////////////////////////////Button handler//////////////////////////////////
  saveButtonHandler = (event) => {
    this.setState({
      onSaveAlert: true,
    });
    setTimeout(this.onSaveAlertCloseHandler, 2000);

    let post_data = { ...this.state.protocol_configuration };
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

  handleSwitchButtonChange = (event) => {
    let protocol_config = { ...this.state.protocol_configuration };
    switch (event.target.name) {
      case "mqttc_en":
        protocol_config.mqttc_en = !protocol_config.mqttc_en;
        break;
      case "mqttc_enable_clean_session":
        protocol_config.mqttc_enable_clean_session = !protocol_config.mqttc_enable_clean_session;
        break;
      case "mqttc_enable_auto_reconnect":
        protocol_config.mqttc_enable_auto_reconnect = !protocol_config.mqttc_enable_auto_reconnect;
        break;

      case "ble_client0_en":
        protocol_config.ble_client0_en = !protocol_config.ble_client0_en;
        break;
      case "ble_client1_en":
        protocol_config.ble_client1_en = !protocol_config.ble_client1_en;
        break;
      case "ble_client2_en":
        protocol_config.ble_client2_en = !protocol_config.ble_client2_en;
        break;
      case "ble_client3_en":
        protocol_config.ble_client3_en = !protocol_config.ble_client3_en;
        break;

      case "ble_client4_en":
        protocol_config.ble_client4_en = !protocol_config.ble_client4_en;
        break;
      case "ble_client5_en":
        protocol_config.ble_client5_en = !protocol_config.ble_client5_en;
        break;
      case "ble_client6_en":
        protocol_config.ble_client6_en = !protocol_config.ble_client6_en;
        break;

      case "ble_client7_en":
        protocol_config.ble_client7_en = !protocol_config.ble_client7_en;
        break;
      case "ble_server_en":
        protocol_config.ble_server_en = !protocol_config.ble_server_en;
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: protocol_config,
    });
  };

  ////////////Select handler/////////////////////////
  MQTTclientQOS_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "mqttc_qos0":
        sys_config.mqttc_qos = "0";
        break;
      case "mqttc_qos1":
        sys_config.mqttc_qos = "1";
        break;
      case "mqttc_qos2":
        sys_config.mqttc_qos = "2";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  // BLE Client UART

  //BLE CLIENT 0
  client0_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client0_max_device_to_scan1":
        sys_config.ble_client0_max_device_to_scan = "1";
        break;
      case "ble_client0_max_device_to_scan2":
        sys_config.ble_client0_max_device_to_scan = "2";
        break;
      case "ble_client0_max_device_to_scan3":
        sys_config.ble_client0_max_device_to_scan = "3";
        break;
      case "ble_client0_max_device_to_scan4":
        sys_config.ble_client0_max_device_to_scan = "4";
        break;
      case "ble_client0_max_device_to_scan5":
        sys_config.ble_client0_max_device_to_scan = "5";
        break;
      case "ble_client0_max_device_to_scan6":
        sys_config.ble_client0_max_device_to_scan = "6";
        break;
      case "ble_client0_max_device_to_scan7":
        sys_config.ble_client0_max_device_to_scan = "7";
        break;
      case "ble_client0_max_device_to_scan8":
        sys_config.ble_client0_max_device_to_scan = "8";
        break;
      case "ble_client0_max_device_to_scan9":
        sys_config.ble_client0_max_device_to_scan = "9";
        break;
      case "ble_client0_max_device_to_scan10":
        sys_config.ble_client0_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  //BLE CLIENT 1
  client1_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client1_max_device_to_scan1":
        sys_config.ble_client1_max_device_to_scan = "1";
        break;
      case "ble_client1_max_device_to_scan2":
        sys_config.ble_client1_max_device_to_scan = "2";
        break;
      case "ble_client1_max_device_to_scan3":
        sys_config.ble_client1_max_device_to_scan = "3";
        break;
      case "ble_client1_max_device_to_scan4":
        sys_config.ble_client1_max_device_to_scan = "4";
        break;
      case "ble_client1_max_device_to_scan5":
        sys_config.ble_client1_max_device_to_scan = "5";
        break;
      case "ble_client1_max_device_to_scan6":
        sys_config.ble_client1_max_device_to_scan = "6";
        break;
      case "ble_client1_max_device_to_scan7":
        sys_config.ble_client1_max_device_to_scan = "7";
        break;
      case "ble_client1_max_device_to_scan8":
        sys_config.ble_client1_max_device_to_scan = "8";
        break;
      case "ble_client1_max_device_to_scan9":
        sys_config.ble_client1_max_device_to_scan = "9";
        break;
      case "ble_client1_max_device_to_scan10":
        sys_config.ble_client1_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  //BLE CLIENT 2
  client2_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client2_max_device_to_scan1":
        sys_config.ble_client2_max_device_to_scan = "1";
        break;
      case "ble_client2_max_device_to_scan2":
        sys_config.ble_client2_max_device_to_scan = "2";
        break;
      case "ble_client2_max_device_to_scan3":
        sys_config.ble_client2_max_device_to_scan = "3";
        break;
      case "ble_client2_max_device_to_scan4":
        sys_config.ble_client2_max_device_to_scan = "4";
        break;
      case "ble_client2_max_device_to_scan5":
        sys_config.ble_client2_max_device_to_scan = "5";
        break;
      case "ble_client2_max_device_to_scan6":
        sys_config.ble_client2_max_device_to_scan = "6";
        break;
      case "ble_client2_max_device_to_scan7":
        sys_config.ble_client2_max_device_to_scan = "7";
        break;
      case "ble_client2_max_device_to_scan8":
        sys_config.ble_client2_max_device_to_scan = "8";
        break;
      case "ble_client2_max_device_to_scan9":
        sys_config.ble_client2_max_device_to_scan = "9";
        break;
      case "ble_client2_max_device_to_scan10":
        sys_config.ble_client2_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  //BLE CLIENT 3
  client3_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client3_max_device_to_scan1":
        sys_config.ble_client3_max_device_to_scan = "1";
        break;
      case "ble_client3_max_device_to_scan2":
        sys_config.ble_client3_max_device_to_scan = "2";
        break;
      case "ble_client3_max_device_to_scan3":
        sys_config.ble_client3_max_device_to_scan = "3";
        break;
      case "ble_client3_max_device_to_scan4":
        sys_config.ble_client3_max_device_to_scan = "4";
        break;
      case "ble_client3_max_device_to_scan5":
        sys_config.ble_client3_max_device_to_scan = "5";
        break;
      case "ble_client3_max_device_to_scan6":
        sys_config.ble_client3_max_device_to_scan = "6";
        break;
      case "ble_client3_max_device_to_scan7":
        sys_config.ble_client3_max_device_to_scan = "7";
        break;
      case "ble_client3_max_device_to_scan8":
        sys_config.ble_client3_max_device_to_scan = "8";
        break;
      case "ble_client3_max_device_to_scan9":
        sys_config.ble_client3_max_device_to_scan = "9";
        break;
      case "ble_client3_max_device_to_scan10":
        sys_config.ble_client3_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  //BLE CLIENT 4
  client4_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client4_max_device_to_scan1":
        sys_config.ble_client4_max_device_to_scan = "1";
        break;
      case "ble_client4_max_device_to_scan2":
        sys_config.ble_client4_max_device_to_scan = "2";
        break;
      case "ble_client4_max_device_to_scan3":
        sys_config.ble_client4_max_device_to_scan = "3";
        break;
      case "ble_client4_max_device_to_scan4":
        sys_config.ble_client4_max_device_to_scan = "4";
        break;
      case "ble_client4_max_device_to_scan5":
        sys_config.ble_client4_max_device_to_scan = "5";
        break;
      case "ble_client4_max_device_to_scan6":
        sys_config.ble_client4_max_device_to_scan = "6";
        break;
      case "ble_client4_max_device_to_scan7":
        sys_config.ble_client4_max_device_to_scan = "7";
        break;
      case "ble_client4_max_device_to_scan8":
        sys_config.ble_client4_max_device_to_scan = "8";
        break;
      case "ble_client4_max_device_to_scan9":
        sys_config.ble_client4_max_device_to_scan = "9";
        break;
      case "ble_client4_max_device_to_scan10":
        sys_config.ble_client4_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };
  5;
  //BLE CLIENT 5
  client5_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client5_max_device_to_scan1":
        sys_config.ble_client5_max_device_to_scan = "1";
        break;
      case "ble_client5_max_device_to_scan2":
        sys_config.ble_client5_max_device_to_scan = "2";
        break;
      case "ble_client5_max_device_to_scan3":
        sys_config.ble_client5_max_device_to_scan = "3";
        break;
      case "ble_client5_max_device_to_scan4":
        sys_config.ble_client5_max_device_to_scan = "4";
        break;
      case "ble_client5_max_device_to_scan5":
        sys_config.ble_client5_max_device_to_scan = "5";
        break;
      case "ble_client5_max_device_to_scan6":
        sys_config.ble_client5_max_device_to_scan = "6";
        break;
      case "ble_client5_max_device_to_scan7":
        sys_config.ble_client5_max_device_to_scan = "7";
        break;
      case "ble_client5_max_device_to_scan8":
        sys_config.ble_client5_max_device_to_scan = "8";
        break;
      case "ble_client5_max_device_to_scan9":
        sys_config.ble_client5_max_device_to_scan = "9";
        break;
      case "ble_client5_max_device_to_scan10":
        sys_config.ble_client5_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  //BLE CLIENT 6
  client6_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client6_max_device_to_scan1":
        sys_config.ble_client6_max_device_to_scan = "1";
        break;
      case "ble_client6_max_device_to_scan2":
        sys_config.ble_client6_max_device_to_scan = "2";
        break;
      case "ble_client6_max_device_to_scan3":
        sys_config.ble_client6_max_device_to_scan = "3";
        break;
      case "ble_client6_max_device_to_scan4":
        sys_config.ble_client6_max_device_to_scan = "4";
        break;
      case "ble_client6_max_device_to_scan5":
        sys_config.ble_client6_max_device_to_scan = "5";
        break;
      case "ble_client6_max_device_to_scan6":
        sys_config.ble_client6_max_device_to_scan = "6";
        break;
      case "ble_client6_max_device_to_scan7":
        sys_config.ble_client6_max_device_to_scan = "7";
        break;
      case "ble_client6_max_device_to_scan8":
        sys_config.ble_client6_max_device_to_scan = "8";
        break;
      case "ble_client6_max_device_to_scan9":
        sys_config.ble_client6_max_device_to_scan = "9";
        break;
      case "ble_client6_max_device_to_scan10":
        sys_config.ble_client6_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  //BLE CLIENT 7
  client7_SelectEventHandle = (event) => {
    let sys_config = { ...this.state.protocol_configuration };
    switch (event.target.value) {
      case "ble_client7_max_device_to_scan1":
        sys_config.ble_client7_max_device_to_scan = "1";
        break;
      case "ble_client7_max_device_to_scan2":
        sys_config.ble_client7_max_device_to_scan = "2";
        break;
      case "ble_client7_max_device_to_scan3":
        sys_config.ble_client7_max_device_to_scan = "3";
        break;
      case "ble_client7_max_device_to_scan4":
        sys_config.ble_client7_max_device_to_scan = "4";
        break;
      case "ble_client7_max_device_to_scan5":
        sys_config.ble_client7_max_device_to_scan = "5";
        break;
      case "ble_client7_max_device_to_scan6":
        sys_config.ble_client7_max_device_to_scan = "6";
        break;
      case "ble_client7_max_device_to_scan7":
        sys_config.ble_client7_max_device_to_scan = "7";
        break;
      case "ble_client7_max_device_to_scan8":
        sys_config.ble_client7_max_device_to_scan = "8";
        break;
      case "ble_client7_max_device_to_scan9":
        sys_config.ble_client7_max_device_to_scan = "9";
        break;
      case "ble_client7_max_device_to_scan10":
        sys_config.ble_client7_max_device_to_scan = "10";
        break;

      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  ///////////////////////////////////////////////////

  FormChangeHandler = (event) => {
    let sys_config = { ...this.state.protocol_configuration };

    switch (event.target.name) {
      // MQTT CLIENT
      case "mqttb_uri":
        sys_config.mqttb_uri = event.target.value;
        break;
      case "mqttb_port":
        sys_config.mqttb_port = event.target.value;
        break;
      case "mqttc_keep_alive_timeout":
        sys_config.mqttc_keep_alive_timeout = event.target.value;
        break;
      case "mqttc_last_will_topic":
        sys_config.mqttc_last_will_topic = event.target.value;
        break;
      case "mqttc_last_will_msg":
        sys_config.mqttc_last_will_msg = event.target.value;
        break;
      //INFLUX DB CLIENT
      case "influxc_host":
        sys_config.influxc_host = event.target.value;
        break;
      case "influxc_port":
        sys_config.influxc_port = event.target.value;
        break;
      case "influxc_db_name":
        sys_config.influxc_db_name = event.target.value;
        break;
      case "influxc_usr_name":
        sys_config.influxc_usr_name = event.target.value;
        break;
      case "influxc_password":
        sys_config.influxc_password = event.target.value;
        break;
      //BLE CLIENT UART 0
      case "ble_client0_name":
        sys_config.ble_client0_name = event.target.value;
        break;

      case "ble_client0_service_uuid":
        sys_config.ble_client0_service_uuid = event.target.value;
        break;
      case "ble_client0_tx_uuid":
        sys_config.ble_client0_tx_uuid = event.target.value;
        break;
      case "ble_client0_rx_uuid":
        sys_config.ble_client0_rx_uuid = event.target.value;
        break;
      case "ble_client0_bonded_dev_address":
        sys_config.ble_client0_bonded_dev_address = event.target.value;
        break;
      case "ble_client0_bonded_dev_address_type":
        sys_config.ble_client0_bonded_dev_address_type = event.target.value;
        break;

      //BLE CLIENT UART 1
      case "ble_client1_name":
        sys_config.ble_client1_name = event.target.value;
        break;

      case "ble_client1_service_uuid":
        sys_config.ble_client1_service_uuid = event.target.value;
        break;
      case "ble_client1_tx_uuid":
        sys_config.ble_client1_tx_uuid = event.target.value;
        break;
      case "ble_client1_rx_uuid":
        sys_config.ble_client1_rx_uuid = event.target.value;
        break;
      case "ble_client1_bonded_dev_address":
        sys_config.ble_client1_bonded_dev_address = event.target.value;
        break;
      case "ble_client1_bonded_dev_address_type":
        sys_config.ble_client1_bonded_dev_address_type = event.target.value;
        break;

      //BLE CLIENT UART 2
      case "ble_client2_name":
        sys_config.ble_client2_name = event.target.value;
        break;

      case "ble_client2_service_uuid":
        sys_config.ble_client2_service_uuid = event.target.value;
        break;
      case "ble_client2_tx_uuid":
        sys_config.ble_client2_tx_uuid = event.target.value;
        break;
      case "ble_client2_rx_uuid":
        sys_config.ble_client2_rx_uuid = event.target.value;
        break;
      case "ble_client2_bonded_dev_address":
        sys_config.ble_client2_bonded_dev_address = event.target.value;
        break;
      case "ble_client2_bonded_dev_address_type":
        sys_config.ble_client2_bonded_dev_address_type = event.target.value;
        break;

      //BLE CLIENT UART 3
      case "ble_client3_name":
        sys_config.ble_client3_name = event.target.value;
        break;

      case "ble_client3_service_uuid":
        sys_config.ble_client3_service_uuid = event.target.value;
        break;
      case "ble_client3_tx_uuid":
        sys_config.ble_client3_tx_uuid = event.target.value;
        break;
      case "ble_client3_rx_uuid":
        sys_config.ble_client3_rx_uuid = event.target.value;
        break;
      case "ble_client3_bonded_dev_address":
        sys_config.ble_client3_bonded_dev_address = event.target.value;
        break;
      case "ble_client3_bonded_dev_address_type":
        sys_config.ble_client3_bonded_dev_address_type = event.target.value;
        break;

      //BLE CLIENT UART 4
      case "ble_client4_name":
        sys_config.ble_client4_name = event.target.value;
        break;

      case "ble_client4_service_uuid":
        sys_config.ble_client4_service_uuid = event.target.value;
        break;
      case "ble_client4_tx_uuid":
        sys_config.ble_client4_tx_uuid = event.target.value;
        break;
      case "ble_client4_rx_uuid":
        sys_config.ble_client4_rx_uuid = event.target.value;
        break;
      case "ble_client4_bonded_dev_address":
        sys_config.ble_client4_bonded_dev_address = event.target.value;
        break;
      case "ble_client4_bonded_dev_address_type":
        sys_config.ble_client4_bonded_dev_address_type = event.target.value;
        break;

      //BLE CLIENT UART5
      case "ble_client5_name":
        sys_config.ble_client5_name = event.target.value;
        break;

      case "ble_client5_service_uuid":
        sys_config.ble_client5_service_uuid = event.target.value;
        break;
      case "ble_client5_tx_uuid":
        sys_config.ble_client5_tx_uuid = event.target.value;
        break;
      case "ble_client5_rx_uuid":
        sys_config.ble_client5_rx_uuid = event.target.value;
        break;
      case "ble_client5_bonded_dev_address":
        sys_config.ble_client5_bonded_dev_address = event.target.value;
        break;
      case "ble_client5_bonded_dev_address_type":
        sys_config.ble_client5_bonded_dev_address_type = event.target.value;
        break;

      //BLE CLIENT UART 6
      case "ble_client6_name":
        sys_config.ble_client6_name = event.target.value;
        break;

      case "ble_client6_service_uuid":
        sys_config.ble_client6_service_uuid = event.target.value;
        break;
      case "ble_client6_tx_uuid":
        sys_config.ble_client6_tx_uuid = event.target.value;
        break;
      case "ble_client6_rx_uuid":
        sys_config.ble_client6_rx_uuid = event.target.value;
        break;
      case "ble_client6_bonded_dev_address":
        sys_config.ble_client6_bonded_dev_address = event.target.value;
        break;
      case "ble_client6_bonded_dev_address_type":
        sys_config.ble_client6_bonded_dev_address_type = event.target.value;
        break;

      //BLE CLIENT UART 7
      case "ble_client7_name":
        sys_config.ble_client7_name = event.target.value;
        break;

      case "ble_client7_service_uuid":
        sys_config.ble_client7_service_uuid = event.target.value;
        break;
      case "ble_client7_tx_uuid":
        sys_config.ble_client7_tx_uuid = event.target.value;
        break;
      case "ble_client7_rx_uuid":
        sys_config.ble_client7_rx_uuid = event.target.value;
        break;
      case "ble_client7_bonded_dev_address":
        sys_config.ble_client7_bonded_dev_address = event.target.value;
        break;
      case "ble_client7_bonded_dev_address_type":
        sys_config.ble_client7_bonded_dev_address_type = event.target.value;
        break;

      // BLE SERVER UART
      case "ble_server_name":
        sys_config.ble_server_name = event.target.value;
        break;

      case "ble_server_service_uuid":
        sys_config.ble_server_service_uuid = event.target.value;
        break;
      case "ble_server_tx_uuid":
        sys_config.ble_server_tx_uuid = event.target.value;
        break;
      case "ble_server_rx_uuid":
        sys_config.ble_server_rx_uuid = event.target.value;
        break;
      case "ble_server_dev_address":
        sys_config.ble_server_dev_address = event.target.value;
        break;
      case "ble_server_dev_address_type":
        sys_config.ble_server_dev_address_type = event.target.value;
        break;
      default:
        break;
    }
    this.setState({
      protocol_configuration: sys_config,
    });
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "menuSelectHandler":
        this.menuSelectHandler(event);
        break;
      case "menuBackButtonHandler":
        this.menuBackButtonHandler(event);
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
      case "onSaveAlertCloseHandler":
        this.onSaveAlertCloseHandler(event);
        break;

      case "handleSwitchButtonChange":
        this.handleSwitchButtonChange(event);
        break;
      case "MQTTclientQOS_SelectEventHandle":
        this.MQTTclientQOS_SelectEventHandle(event);
        break;
      case "client0_SelectEventHandle":
        this.client0_SelectEventHandle(event);
        break;
      case "client1_SelectEventHandle":
        this.client1_SelectEventHandle(event);
        break;
      case "client2_SelectEventHandle":
        this.client2_SelectEventHandle(event);
        break;
      case "client3_SelectEventHandle":
        this.client3_SelectEventHandle(event);
        break;
      case "client4_SelectEventHandle":
        this.client4_SelectEventHandle(event);
        break;
      case "client5_SelectEventHandle":
        this.client5_SelectEventHandle(event);
        break;
      case "client6_SelectEventHandle":
        this.client6_SelectEventHandle(event);
        break;
      case "client7_SelectEventHandle":
        this.client7_SelectEventHandle(event);
        break;
      case "FormChangeHandler":
        this.FormChangeHandler(event);
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
            <Form.Label>Select Protocol Configuration</Form.Label>
            <Menu
              style={{ width: "200px", height: "200px" }}
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
              Device UUID: {this.state.protocol_configuration.device_id}
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

  MQTTclientPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="Enable MQTT"
                  checked={this.state.protocol_configuration.mqttc_en}
                  name="mqttc_en"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>URI</Form.Label>
                <Form.Control
                  placeholder="Enter MQTT URI"
                  type="text"
                  maxLength="80"
                  name="mqttb_uri"
                  onChange={(event) =>
                    this.centralEventHandler("FormChangeHandler", event)
                  }
                  value={this.state.protocol_configuration.mqttb_uri}
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Last Will Topic</Form.Label>
                <Form.Control
                  placeholder="Enter MQTT Last Will Topic"
                  type="text"
                  name="mqttc_last_will_topic"
                  value={
                    this.state.protocol_configuration.mqttc_last_will_topic
                  }
                  maxLength="20"
                  onChange={(event) =>
                    this.centralEventHandler("FormChangeHandler", event)
                  }
                />
              </Col>
            </Row>
          </Col>

          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch2"
                  label="Clean Session"
                  checked={
                    this.state.protocol_configuration.mqttc_enable_clean_session
                  }
                  name="mqttc_enable_clean_session"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>PORT</Form.Label>
                <Form.Control
                  placeholder="Enter MQTT Port"
                  type="number"
                  value={this.state.protocol_configuration.mqttb_port}
                  maxLength="10"
                  name="mqttb_port"
                  onChange={(event) =>
                    this.centralEventHandler("FormChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Last Will Message</Form.Label>
                <Form.Control
                  placeholder="Enter MQTT Last Will Message"
                  type="text"
                  value={this.state.protocol_configuration.mqttc_last_will_msg}
                  maxLength="20"
                  name="mqttc_last_will_msg"
                  onChange={(event) =>
                    this.centralEventHandler("FormChangeHandler", event)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Check
                  type="switch"
                  id="custom-switch3"
                  label="Auto Reconnect"
                  checked={
                    this.state.protocol_configuration
                      .mqttc_enable_auto_reconnect
                  }
                  name="mqttc_enable_auto_reconnect"
                  onChange={(event) =>
                    this.centralEventHandler("handleSwitchButtonChange", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>Keep Alive Timeout</Form.Label>
                <Form.Control
                  placeholder="Enter MQTT Keep Alive Timeout"
                  type="number"
                  name="mqttc_keep_alive_timeout"
                  value={
                    this.state.protocol_configuration.mqttc_keep_alive_timeout
                  }
                  maxLength="20"
                  onChange={(event) =>
                    this.centralEventHandler("FormChangeHandler", event)
                  }
                />
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm="8">
                <Form.Label>QOS</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.centralEventHandler(
                      "MQTTclientQOS_SelectEventHandle",
                      event
                    )
                  }
                  value={`mqttc_qos${this.state.protocol_configuration.mqttc_qos}`}
                >
                  {MQTTclientQOS_ParameterOption.map((item, index) => {
                    return <option value={`mqttc_qos${item}`}>{item}</option>;
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

  InfluxDBclientPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Influx Client Host</Form.Label>
            <Form.Control
              placeholder="Enter Influx Client Host"
              type="text"
              value={this.state.protocol_configuration.influxc_host}
              maxLength="20"
              name="influxc_host"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Influx Client DB Name</Form.Label>
            <Form.Control
              placeholder="Enter Influx Client DB Name"
              type="text"
              value={this.state.protocol_configuration.influxc_db_name}
              maxLength="20"
              name="influxc_db_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Influx Client Port</Form.Label>
            <Form.Control
              placeholder="Enter Influx Client Port"
              type="number"
              value={this.state.protocol_configuration.influxc_port}
              maxLength="10"
              name="influxc_port"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Influx Client User Name</Form.Label>
            <Form.Control
              placeholder="Enter Influx Client User Name"
              maxLength="20"
              required={true}
              type="text"
              value={this.state.protocol_configuration.influxc_usr_name}
              name="influxc_usr_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <Col sm="6">
            <Form.Label>Influx Client Password</Form.Label>
            <Form.Control
              placeholder="Influx Client Password"
              type="password"
              maxLength="20"
              required={true}
              value={this.state.protocol_configuration.influxc_password}
              name="influxc_password"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

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

  Client0PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 0"
              checked={this.state.protocol_configuration.ble_client0_en}
              name="ble_client0_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 0 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client0_name}
              maxLength="20"
              name="ble_client0_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client0_SelectEventHandle", event)
              }
              value={`ble_client0_max_device_to_scan${this.state.protocol_configuration.ble_client0_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client0_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 0 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client0_service_uuid}
              maxLength="48"
              name="ble_client0_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 0 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client0_tx_uuid}
              maxLength="48"
              name="ble_client0_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 0 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client0_rx_uuid}
              maxLength="48"
              name="ble_client0_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 0 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client0_bonded_dev_address
              }
              maxLength="48"
              name="ble_client0_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client0_bonded_dev_address_type
              }
              name="ble_client0_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  Client1PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 1"
              checked={this.state.protocol_configuration.ble_client1_en}
              name="ble_client1_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 1 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client1_name}
              maxLength="20"
              name="ble_client1_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client1_SelectEventHandle", event)
              }
              value={`ble_client1_max_device_to_scan${this.state.protocol_configuration.ble_client1_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client1_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 1 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client1_service_uuid}
              maxLength="48"
              name="ble_client1_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 1 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client1_tx_uuid}
              maxLength="48"
              name="ble_client1_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 1 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client1_rx_uuid}
              maxLength="48"
              name="ble_client1_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 1 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client1_bonded_dev_address
              }
              maxLength="48"
              name="ble_client1_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client1_bonded_dev_address_type
              }
              name="ble_client1_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  Client2PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 2"
              checked={this.state.protocol_configuration.ble_client2_en}
              name="ble_client2_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 2 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client2_name}
              maxLength="20"
              name="ble_client2_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client2_SelectEventHandle", event)
              }
              value={`ble_client2_max_device_to_scan${this.state.protocol_configuration.ble_client2_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client2_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 2 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client2_service_uuid}
              maxLength="48"
              name="ble_client2_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 2 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client2_tx_uuid}
              maxLength="48"
              name="ble_client2_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 2 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client2_rx_uuid}
              maxLength="48"
              name="ble_client2_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 2 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client2_bonded_dev_address
              }
              maxLength="48"
              name="ble_client2_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client2_bonded_dev_address_type
              }
              name="ble_client2_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  Client3PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 3"
              checked={this.state.protocol_configuration.ble_client3_en}
              name="ble_client3_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 3 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client3_name}
              maxLength="20"
              name="ble_client3_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client3_SelectEventHandle", event)
              }
              value={`ble_client3_max_device_to_scan${this.state.protocol_configuration.ble_client3_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client3_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 3 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client3_service_uuid}
              maxLength="48"
              name="ble_client3_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 3 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client3_tx_uuid}
              maxLength="48"
              name="ble_client3_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 3 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client3_rx_uuid}
              maxLength="48"
              name="ble_client3_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 3 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client3_bonded_dev_address
              }
              maxLength="48"
              name="ble_client3_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client3_bonded_dev_address_type
              }
              name="ble_client3_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  Client4PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 4"
              checked={this.state.protocol_configuration.ble_client4_en}
              name="ble_client4_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 4 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client4_name}
              maxLength="20"
              name="ble_client4_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client4_SelectEventHandle", event)
              }
              value={`ble_client4_max_device_to_scan${this.state.protocol_configuration.ble_client4_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client4_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 4 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client4_service_uuid}
              maxLength="48"
              name="ble_client4_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 4 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client4_tx_uuid}
              maxLength="48"
              name="ble_client4_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 4 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client4_rx_uuid}
              maxLength="48"
              name="ble_client4_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 4 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client4_bonded_dev_address
              }
              maxLength="48"
              name="ble_client4_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client4_bonded_dev_address_type
              }
              name="ble_client4_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  Client5PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 5"
              checked={this.state.protocol_configuration.ble_client5_en}
              name="ble_client5_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 5 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client5_name}
              maxLength="20"
              name="ble_client5_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client5_SelectEventHandle", event)
              }
              value={`ble_client5_max_device_to_scan${this.state.protocol_configuration.ble_client5_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client5_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 5 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client5_service_uuid}
              maxLength="48"
              name="ble_client5_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 5 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client5_tx_uuid}
              maxLength="48"
              name="ble_client5_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 5 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client5_rx_uuid}
              maxLength="48"
              name="ble_client5_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 5 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client5_bonded_dev_address
              }
              maxLength="48"
              name="ble_client5_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client5_bonded_dev_address_type
              }
              name="ble_client5_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  Client6PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 6"
              checked={this.state.protocol_configuration.ble_client6_en}
              name="ble_client6_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 6 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client6_name}
              maxLength="20"
              name="ble_client6_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client6_SelectEventHandle", event)
              }
              value={`ble_client6_max_device_to_scan${this.state.protocol_configuration.ble_client6_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client6_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 6 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client6_service_uuid}
              maxLength="48"
              name="ble_client6_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 6 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client6_tx_uuid}
              maxLength="48"
              name="ble_client6_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 6 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client6_rx_uuid}
              maxLength="48"
              name="ble_client6_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 6 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client6_bonded_dev_address
              }
              maxLength="48"
              name="ble_client6_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client6_bonded_dev_address_type
              }
              name="ble_client6_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  Client7PanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch4"
              label="Client 7"
              checked={this.state.protocol_configuration.ble_client7_en}
              name="ble_client7_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="BLE Client 7 Name"
              type="text"
              value={this.state.protocol_configuration.ble_client7_name}
              maxLength="20"
              name="ble_client7_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>Max Devices To Scan</Form.Label>
            <Form.Control
              as="select"
              onChange={(event) =>
                this.centralEventHandler("client7_SelectEventHandle", event)
              }
              value={`ble_client7_max_device_to_scan${this.state.protocol_configuration.ble_client7_max_device_to_scan}`}
            >
              {BLEclient_ParameterOption.map((item, index) => {
                return (
                  <option value={`ble_client7_max_device_to_scan${item}`}>
                    {item}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Service UUID</Form.Label>
            <Form.Control
              placeholder="Client 7 Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client7_service_uuid}
              maxLength="48"
              name="ble_client7_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>TX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 7 TX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client7_tx_uuid}
              maxLength="48"
              name="ble_client7_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>RX UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 7 RX UUID"
              type="text"
              value={this.state.protocol_configuration.ble_client7_rx_uuid}
              maxLength="48"
              name="ble_client7_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>

        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>Bonded Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Client 7 Bonded Device Address"
              type="text"
              value={
                this.state.protocol_configuration.ble_client7_bonded_dev_address
              }
              maxLength="48"
              name="ble_client7_bonded_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="6">
            <Form.Label>Bonded Device Address Type</Form.Label>
            <Form.Control
              as="select"
              value={
                this.state.protocol_configuration
                  .ble_client7_bonded_dev_address_type
              }
              name="ble_client7_bonded_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
  BLEserverUARTpanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Check
              style={{ marginTop: "40px" }}
              type="switch"
              id="custom-switch12"
              label="Enable BLE Server"
              checked={this.state.protocol_configuration.ble_server_en}
              name="ble_server_en"
              onChange={(event) =>
                this.centralEventHandler("handleSwitchButtonChange", event)
              }
            />
          </Col>
          <Col sm="4">
            <Form.Label>BLE Server Tx UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Server Tx UUID"
              type="text"
              value={this.state.protocol_configuration.ble_server_tx_uuid}
              maxLength="20"
              name="ble_server_tx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>

          <Col sm="4">
            <Form.Label>BLE Server Rx UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Server Rx UUID"
              type="text"
              name=""
              value={this.state.protocol_configuration.ble_server_rx_uuid}
              maxLength="20"
              name="ble_server_rx_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>BLE Server Name</Form.Label>
            <Form.Control
              placeholder="Enter BLE Server Name"
              type="text"
              value={this.state.protocol_configuration.ble_server_name}
              maxLength="20"
              name="ble_server_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <Col sm="6">
            <Form.Label>BLE Server Service UUID</Form.Label>
            <Form.Control
              placeholder="Enter BLE Server Service UUID"
              type="text"
              value={this.state.protocol_configuration.ble_server_service_uuid}
              maxLength="20"
              name="ble_server_service_uuid"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="6">
            <Form.Label>BLE Server Device Address</Form.Label>
            <Form.Control
              placeholder="Enter BLE Server Device Address"
              type="text"
              value={this.state.protocol_configuration.ble_server_dev_address}
              name="ble_server_dev_address"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            ></Form.Control>
          </Col>
          <Col sm="6">
            <Form.Label>BLE Server Device Address Type</Form.Label>
            <Form.Control
              placeholder="Enter BLE Server Device Address Type"
              as="select"
              value={
                this.state.protocol_configuration.ble_server_dev_address_type
              }
              name="ble_server_dev_address_type"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            >
              {BLEclient_AddressType.map((item, index) => {
                return <option value={item}>{item}</option>;
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
            {this.navbarInterface("Protocol Configuration")}
            <Container>
              {this.panelInterface("", this.mainMenuPanelContent())}
            </Container>
          </div>
        );
        break;

      case "MQTT Client":
        return (
          <div>
            {this.navbarInterface("MQTT Client")}
            <Container>
              {this.panelInterface("", this.MQTTclientPanelContent())}
            </Container>
          </div>
        );
        break;

      case "Influx DB Client":
        return (
          <div>
            {this.navbarInterface("Influx DB Client")}
            <Container>
              {this.panelInterface("", this.InfluxDBclientPanelContent())}
            </Container>
          </div>
        );
        break;

      case "BLE Client 0":
        return (
          <div>
            {this.navbarInterface("BLE Client 0")}
            <Container>
              {this.panelInterface("", this.Client0PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Client 1":
        return (
          <div>
            {this.navbarInterface("BLE Client 1")}
            <Container>
              {this.panelInterface("", this.Client1PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Client 2":
        return (
          <div>
            {this.navbarInterface("BLE Client 2")}
            <Container>
              {this.panelInterface("", this.Client2PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Client 3":
        return (
          <div>
            {this.navbarInterface("BLE Client 3")}
            <Container>
              {this.panelInterface("", this.Client3PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Client 4":
        return (
          <div>
            {this.navbarInterface("BLE Client 4")}
            <Container>
              {this.panelInterface("", this.Client4PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Client 5":
        return (
          <div>
            {this.navbarInterface("BLE Client 5")}
            <Container>
              {this.panelInterface("", this.Client5PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Client 6":
        return (
          <div>
            {this.navbarInterface("BLE Client 6")}
            <Container>
              {this.panelInterface("", this.Client6PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Client 7":
        return (
          <div>
            {this.navbarInterface("BLE Client 7")}
            <Container>
              {this.panelInterface("", this.Client7PanelContent())}
            </Container>
          </div>
        );

        break;
      case "BLE Server":
        return (
          <div>
            {this.navbarInterface("BLE Server")}
            <Container>
              {this.panelInterface("", this.BLEserverUARTpanelContent())}
            </Container>
          </div>
        );
        break;
    }
  }
}

ProtocolConfigPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProtocolConfigPage);
