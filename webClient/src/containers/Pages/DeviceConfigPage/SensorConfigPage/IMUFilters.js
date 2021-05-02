import React, { Component } from "react";
import "./IMUFilters.css";
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
import accelerationImage from "../../../../assets/acceleration.png";
import GyroImage from "../../../../assets/gyro.png";
import OrientationImage from "../../../../assets/orientation.svg";
import ComplementaryImage from "../../../../assets/complementary.png";
import MadgwickImage from "../../../../assets/madgwick.png";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

class IMUFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device_id: this.props.device_id,
      currentPanelContent: "",
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",

      acc_enable: false,
      acc_ModelError_Xaxis: "",
      acc_ModelError_Yaxis: "",
      acc_ModelError_Zaxis: "",
      acc_MeasurementError_Xaxis: "",
      acc_MeasurementError_Yaxis: "",
      acc_MeasurementError_Zaxis: "",
      acc_ConvergenceFactor_Xaxis: "",
      acc_ConvergenceFactor_Yaxis: "",
      acc_ConvergenceFactor_Zaxis: "",

      gyro_enable: false,
      gyro_ModelError_Xaxis: "",
      gyro_ModelError_Yaxis: "",
      gyro_ModelError_Zaxis: "",
      gyro_MeasurementError_Xaxis: "",
      gyro_MeasurementError_Yaxis: "",
      gyro_MeasurementError_Zaxis: "",
      gyro_ConvergenceFactor_Xaxis: "",
      gyro_ConvergenceFactor_Yaxis: "",
      gyro_ConvergenceFactor_Zaxis: "",

      orient_enable: false,
      orient_ModelError_Xaxis: "",
      orient_ModelError_Yaxis: "",
      orient_ModelError_Zaxis: "",
      orient_MeasurementError_Xaxis: "",
      orient_MeasurementError_Yaxis: "",
      orient_MeasurementError_Zaxis: "",
      orient_ConvergenceFactor_Xaxis: "",
      orient_ConvergenceFactor_Yaxis: "",
      orient_ConvergenceFactor_Zaxis: "",

      complementary_enable: false,
      trustWeightAccelerometer: "",
      trustWeightGyroscope: "",

      madgwick_enable: false,
      madgwickBeta: ""
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
    }, 3000);
  };


  onSaveAlertCloseHandler = (event) => {
    this.setState({
      showflashMessage: false,
    });
  };


  componentDidMount() {
    const data = {
      operation: "filter",
      device_id: this.state.device_id,
    };

    axios
      .get(this.props.server_address + `/uptime/sense/device/config`, {
        params: data,
      })
      .then((response) => {
        if (response.data["status"] === "success") {
          this.setState({
            acc_enable: response.data["acc_enable"],
            acc_ModelError_Xaxis: response.data["acc_ModelError_Xaxis"],
            acc_ModelError_Yaxis: response.data["acc_ModelError_Yaxis"],
            acc_ModelError_Zaxis: response.data["acc_ModelError_Zaxis"],
            acc_MeasurementError_Xaxis: response.data["acc_MeasurementError_Xaxis"],
            acc_MeasurementError_Yaxis: response.data["acc_MeasurementError_Yaxis"],
            acc_MeasurementError_Zaxis: response.data["acc_MeasurementError_Zaxis"],
            acc_ConvergenceFactor_Xaxis: response.data["acc_ConvergenceFactor_Xaxis"],
            acc_ConvergenceFactor_Yaxis: response.data["acc_ConvergenceFactor_Yaxis"],
            acc_ConvergenceFactor_Zaxis: response.data["acc_ConvergenceFactor_Zaxis"],

            gyro_enable: response.data["gyro_enable"],
            gyro_ModelError_Xaxis: response.data["gyro_ModelError_Xaxis"],
            gyro_ModelError_Yaxis: response.data["gyro_ModelError_Yaxis"],
            gyro_ModelError_Zaxis: response.data["gyro_ModelError_Zaxis"],
            gyro_MeasurementError_Xaxis: response.data["gyro_MeasurementError_Xaxis"],
            gyro_MeasurementError_Yaxis: response.data["gyro_MeasurementError_Yaxis"],
            gyro_MeasurementError_Zaxis: response.data["gyro_MeasurementError_Zaxis"],
            gyro_ConvergenceFactor_Xaxis: response.data["gyro_ConvergenceFactor_Xaxis"],
            gyro_ConvergenceFactor_Yaxis: response.data["gyro_ConvergenceFactor_Yaxis"],
            gyro_ConvergenceFactor_Zaxis: response.data["gyro_ConvergenceFactor_Zaxis"],

            orient_enable: response.data["orient_enable"],
            orient_ModelError_Xaxis: response.data["orient_ModelError_Xaxis"],
            orient_ModelError_Yaxis: response.data["orient_ModelError_Yaxis"],
            orient_ModelError_Zaxis: response.data["orient_ModelError_Zaxis"],
            orient_MeasurementError_Xaxis: response.data["orient_MeasurementError_Xaxis"],
            orient_MeasurementError_Yaxis: response.data["orient_MeasurementError_Yaxis"],
            orient_MeasurementError_Zaxis: response.data["orient_MeasurementError_Zaxis"],
            orient_ConvergenceFactor_Xaxis: response.data["orient_ConvergenceFactor_Xaxis"],
            orient_ConvergenceFactor_Yaxis: response.data["orient_ConvergenceFactor_Yaxis"],
            orient_ConvergenceFactor_Zaxis: response.data["orient_ConvergenceFactor_Zaxis"],

            complementary_enable: response.data["complementary_enable"],
            trustWeightAccelerometer: response.data["trustWeightAccelerometer"],
            trustWeightGyroscope: response.data["trustWeightGyroscope"],

            madgwick_enable: response.data["madgwick_enable"],
            madgwickBeta: response.data["madgwickBeta"],
          });
        } else {
          this.flashAlert("Failed to fetch data from web server", "danger");
        }
      })
      .catch((response) => {
        this.props.history.push({
          pathname: "/uptime/error",
        });
      });
  }
  //============== Buttons =================

  saveButtonHandler = (event) => {
    let post_data = { "operation": "filter", ...this.state };
    delete post_data.currentPanelContent;
    delete post_data.showflashMessage;
    delete post_data.flashVariant;
    delete post_data.flashMessage;
    axios
      .post(
        this.props.server_address + "/uptime/sense/device/config",
        post_data
      )
      .then((response) => {
        if (response.data["status"] === "success") {
          this.flashAlert("Successfully Saved", "info")
        } else {
          this.flashAlert("Failed To Save", "danger")
        }
      });
  };

  backButtonClickHandler = () => {
    this.props.history.push({
      pathname: "/uptime/sense/device/config",
    });
  };

  accParamChange = (event) => {
    switch (event.target.name) {
      case "ModelError_Xaxis":
        this.setState({
          acc_ModelError_Xaxis: event.target.value,
        });
        break;

      case "ModelError_Yaxis":
        this.setState({
          acc_ModelError_Yaxis: event.target.value,
        });
        break;

      case "ModelError_Zaxis":
        this.setState({
          acc_ModelError_Zaxis: event.target.value,
        });
        break;

      case "MeasurementError_Xaxis":
        this.setState({
          acc_MeasurementError_Xaxis: event.target.value,
        });
        break;

      case "MeasurementError_Yaxis":
        this.setState({
          acc_MeasurementError_Yaxis: event.target.value,
        });
        break;

      case "MeasurementError_Zaxis":
        this.setState({
          acc_MeasurementError_Zaxis: event.target.value,
        });
        break;

      case "ConvergenceFactor_Xaxis":
        this.setState({
          acc_ConvergenceFactor_Xaxis: event.target.value,
        });
        break;

      case "ConvergenceFactor_Yaxis":
        this.setState({
          acc_ConvergenceFactor_Yaxis: event.target.value,
        });
        break;
      case "ConvergenceFactor_Zaxis":
        this.setState({
          acc_ConvergenceFactor_Zaxis: event.target.value,
        });
        break;
      default:
        break;
    }
  }


  gyroParamChange = (event) => {
    switch (event.target.name) {
      case "ModelError_Xaxis":
        this.setState({
          gyro_ModelError_Xaxis: event.target.value,
        });
        break;

      case "ModelError_Yaxis":
        this.setState({
          gyro_ModelError_Yaxis: event.target.value,
        });
        break;

      case "ModelError_Zaxis":
        this.setState({
          gyro_ModelError_Zaxis: event.target.value,
        });
        break;

      case "MeasurementError_Xaxis":
        this.setState({
          gyro_MeasurementError_Xaxis: event.target.value,
        });
        break;

      case "MeasurementError_Yaxis":
        this.setState({
          gyro_MeasurementError_Yaxis: event.target.value,
        });
        break;

      case "MeasurementError_Zaxis":
        this.setState({
          gyro_MeasurementError_Zaxis: event.target.value,
        });
        break;

      case "ConvergenceFactor_Xaxis":
        this.setState({
          gyro_ConvergenceFactor_Xaxis: event.target.value,
        });
        break;

      case "ConvergenceFactor_Yaxis":
        this.setState({
          gyro_ConvergenceFactor_Yaxis: event.target.value,
        });
        break;
      case "ConvergenceFactor_Zaxis":
        this.setState({
          gyro_ConvergenceFactor_Zaxis: event.target.value,
        });
        break;
      default:
        break;
    }
  }


  orientParamChange = (event) => {
    switch (event.target.name) {
      case "ModelError_Xaxis":
        this.setState({
          orient_ModelError_Xaxis: event.target.value,
        });
        break;

      case "ModelError_Yaxis":
        this.setState({
          orient_ModelError_Yaxis: event.target.value,
        });
        break;

      case "ModelError_Zaxis":
        this.setState({
          orient_ModelError_Zaxis: event.target.value,
        });
        break;

      case "MeasurementError_Xaxis":
        this.setState({
          orient_MeasurementError_Xaxis: event.target.value,
        });
        break;

      case "MeasurementError_Yaxis":
        this.setState({
          orient_MeasurementError_Yaxis: event.target.value,
        });
        break;

      case "MeasurementError_Zaxis":
        this.setState({
          orient_MeasurementError_Zaxis: event.target.value,
        });
        break;

      case "ConvergenceFactor_Xaxis":
        this.setState({
          orient_ConvergenceFactor_Xaxis: event.target.value,
        });
        break;

      case "ConvergenceFactor_Yaxis":
        this.setState({
          orient_ConvergenceFactor_Yaxis: event.target.value,
        });
        break;
      case "ConvergenceFactor_Zaxis":
        this.setState({
          orient_ConvergenceFactor_Zaxis: event.target.value,
        });
        break;
      default:
        break;
    }
  }


  complementaryParamChange = (event) => {
    switch (event.target.name) {
      case "trustWeightAccelerometer":
        this.setState({
          trustWeightAccelerometer: event.target.value,
        });
        break;
      case "trustWeightGyroscope":
        this.setState({
          trustWeightGyroscope: event.target.value,
        });
        break;
      default:
        break;
    }
  }


  madgwickParamChange = (event) => {
    switch (event.target.name) {
      case "madgwickBeta":
        this.setState({
          madgwickBeta: event.target.value,
        });
        break;
      default:
        break;
    }
  }

  // Parameter change handler
  ParameterChangeHandler = (event) => {
    switch (this.state.currentPanelContent) {
      case "acceleration":
        this.accParamChange(event)
        break;
      case "gyro":
        this.gyroParamChange(event)
        break;
      case "orientation":
        this.orientParamChange(event)
        break;
      case "complementary":
        this.complementaryParamChange(event)
        break;
      case "madgwick":
        this.madgwickParamChange(event)
        break;
      default:
        break;
    }
  };

  EnablerHandler = (event) => {
    const en_name = event.target.name
    switch (event.target.name) {
      case "acc_enable":
        this.setState({
          acc_enable: !this.state.acc_enable
        })
        break;
      case "gyro_enable":
        this.setState({
          gyro_enable: !this.state.gyro_enable
        })
        break;
      case "orient_enable":
        this.setState({
          orient_enable: !this.state.orient_enable
        })
        break;
      case "complementary_enable":
        this.setState({
          complementary_enable: !this.state.complementary_enable
        })
        break;
      case "madgwick_enable":
        this.setState({
          madgwick_enable: !this.state.madgwick_enable
        })
        break;
      default:
        break;
    }
  }

  // ======== Central event handler ===============
  centralEventHandler = (option, event) => {
    switch (option) {
      case "acceleration_button":
        this.accelerationSaveButtonClickHandler();
        break;
      case "Gyro_button":
        this.GyroButtonSaveClickHandler();
        break;
      case "Orientation_button":
        this.OrientationSaveButtonClickHandler();
        break;
      case "back_button":
        this.backButtonClickHandler();
        break;
      case "save_button":
        this.saveButtonHandler();
        break;
      case "iconClickHandler":
        this.iconClickHandler(event);
        break;
      case "ParameterChangeHandler":
        this.ParameterChangeHandler(event);
        break;
      case "EnablerHandler":
        this.EnablerHandler(event);
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

  accPanelContent = () => {
    return (
      <div>
        <Row>
          <Row>
            <Col sm="8">
              <Form.Check
                type="switch"
                id="custom-switch1"
                label="Activate"
                style={{ marginTop: "25px" }}
                checked={this.state.acc_enable}
                name="acc_enable"
                onClick={(event) =>
                  this.centralEventHandler("EnablerHandler", event)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="10">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "150px" }}>Parameter </th>
                    <th>X-Axis</th>
                    <th>Y-Axis</th>
                    <th>Z-Axis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Model Error</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="ModelError_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.acc_ModelError_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ModelError_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.acc_ModelError_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ModelError_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.acc_ModelError_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Measurement Error</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="MeasurementError_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.acc_MeasurementError_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="MeasurementError_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.acc_MeasurementError_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="MeasurementError_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.acc_MeasurementError_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>

                  <tr>
                    <td>Convergence Factor</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="ConvergenceFactor_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.acc_ConvergenceFactor_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ConvergenceFactor_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.acc_ConvergenceFactor_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ConvergenceFactor_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.acc_ConvergenceFactor_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Row>
        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("back_button", event);
              }}
            >
              Back
            </Button>
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("save_button", event);
              }}
            >
              Save
            </Button>
          </Col>
        </Row>

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant={this.state.flashVariant}
          show={this.state.showflashMessage}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>{this.state.flashMessage}</div>
        </Alert>
      </div>
    );
  };



  gyroPanelContent = () => {
    return (
      <div>
        <Row>
          <Row>
            <Col sm="8">
              <Form.Check
                type="switch"
                id="custom-switch1"
                label="Activate"
                style={{ marginTop: "25px" }}
                checked={this.state.gyro_enable}
                name="gyro_enable"
                onClick={(event) =>
                  this.centralEventHandler("EnablerHandler", event)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="10">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "150px" }}>Parameter </th>
                    <th>X-Axis</th>
                    <th>Y-Axis</th>
                    <th>Z-Axis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Model Error</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="ModelError_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.gyro_ModelError_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ModelError_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.gyro_ModelError_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ModelError_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.gyro_ModelError_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Measurement Error</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="MeasurementError_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.gyro_MeasurementError_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="MeasurementError_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.gyro_MeasurementError_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="MeasurementError_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.gyro_MeasurementError_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>

                  <tr>
                    <td>Convergence Factor</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="ConvergenceFactor_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.gyro_ConvergenceFactor_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ConvergenceFactor_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.gyro_ConvergenceFactor_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ConvergenceFactor_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.gyro_ConvergenceFactor_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Row>
        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("back_button", event);
              }}
            >
              Back
            </Button>
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("save_button", event);
              }}
            >
              Save
            </Button>
          </Col>
        </Row>

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant={this.state.flashVariant}
          show={this.state.showflashMessage}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>{this.state.flashMessage}</div>
        </Alert>
      </div>
    );
  };


  orientPanelContent = () => {
    return (
      <div>
        <Row>
          <Row>
            <Col sm="8">
              <Form.Check
                type="switch"
                id="custom-switch1"
                label="Activate"
                style={{ marginTop: "25px" }}
                checked={this.state.orient_enable}
                name="orient_enable"
                onClick={(event) =>
                  this.centralEventHandler("EnablerHandler", event)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="10">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "150px" }}>Parameter </th>
                    <th>X-Axis</th>
                    <th>Y-Axis</th>
                    <th>Z-Axis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Model Error</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="ModelError_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.orient_ModelError_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ModelError_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.orient_ModelError_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ModelError_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.orient_ModelError_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Measurement Error</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="MeasurementError_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.orient_MeasurementError_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="MeasurementError_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.orient_MeasurementError_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="MeasurementError_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.orient_MeasurementError_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>

                  <tr>
                    <td>Convergence Factor</td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Col sm="20">
                          <Form.Control
                            type="text-area"
                            maxLength="10"
                            required={true}
                            name="ConvergenceFactor_Xaxis"
                            onChange={(event) =>
                              this.centralEventHandler(
                                "ParameterChangeHandler",
                                event
                              )
                            }
                            value={this.state.orient_ConvergenceFactor_Xaxis}
                          />
                        </Col>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ConvergenceFactor_Yaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.orient_ConvergenceFactor_Yaxis}
                        />
                      </Form.Group>
                    </td>

                    <td>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="ConvergenceFactor_Zaxis"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.orient_ConvergenceFactor_Zaxis}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Row>
        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("back_button", event);
              }}
            >
              Back
            </Button>
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("save_button", event);
              }}
            >
              Save
            </Button>
          </Col>
        </Row>

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant={this.state.flashVariant}
          show={this.state.showflashMessage}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>{this.state.flashMessage}</div>
        </Alert>
      </div>
    );
  };


  accelerationPanelContent = () => {
    return (
      <div>
        <Form.Label class="font-weight-bold">
          Kalman Filter Parameters For Acceleration
        </Form.Label>
        {this.accPanelContent()}
      </div>
    );
  };

  GyroPanelContent = () => {
    return (
      <div>
        <Form.Label class="font-weight-bold">
          Kalman Filter Parameters For Gyroscope
        </Form.Label>
        {this.gyroPanelContent()}
      </div>
    );
  };

  OrientationPanelContent = () => {
    return (
      <div>
        <Form.Label class="font-weight-bold">
          Kalman Filter Parameters For Orientation
        </Form.Label>
        {this.orientPanelContent()}
      </div>
    );
  };

  ComplementaryPanelContent = () => {
    return (
      <div>
        <Form.Label class="font-weight-bold">
          Configure Complementary Filter Parameters
      </Form.Label>

        <Row>
          <Col sm="8">
            <Form.Check
              type="switch"
              id="custom-switch1"
              label="Activate"
              style={{ marginTop: "25px" }}
              checked={this.state.complementary_enable}
              name="complementary_enable"
              onClick={(event) =>
                this.centralEventHandler("EnablerHandler", event)
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="8">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Accelerometer Weight factor</th>
                  <th>Gyroscope weight factor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Col sm="20">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="trustWeightAccelerometer"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.trustWeightAccelerometer}
                        />
                      </Col>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Control
                        type="text-area"
                        maxLength="10"
                        required={true}
                        name="trustWeightGyroscope"
                        onChange={(event) =>
                          this.centralEventHandler(
                            "ParameterChangeHandler",
                            event
                          )
                        }
                        value={this.state.trustWeightGyroscope}
                      />
                    </Form.Group>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("back_button", event);
              }}
            >
              Back
            </Button>
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("save_button", event);
              }}
            >
              Save
            </Button>
          </Col>
        </Row>

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant={this.state.flashVariant}
          show={this.state.showflashMessage}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>{this.state.flashMessage}</div>
        </Alert>
      </div>
    )
  }


  MadgwickPanelContent = () => {
    return (
      <div>
        <Form.Label class="font-weight-bold">
          Configure Madgwick Filter Parameters
      </Form.Label>

        <Row>
          <Col sm="8">
            <Form.Check
              type="switch"
              id="custom-switch1"
              label="Activate"
              style={{ marginTop: "25px" }}
              checked={this.state.madgwick_enable}
              name="madgwick_enable"
              onClick={(event) =>
                this.centralEventHandler("EnablerHandler", event)
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="8">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Beta Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Col sm="20">
                        <Form.Control
                          type="text-area"
                          maxLength="10"
                          required={true}
                          name="madgwickBeta"
                          onChange={(event) =>
                            this.centralEventHandler(
                              "ParameterChangeHandler",
                              event
                            )
                          }
                          value={this.state.madgwickBeta}
                        />
                      </Col>
                    </Form.Group>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("back_button", event);
              }}
            >
              Back
            </Button>
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(event) => {
                this.centralEventHandler("save_button", event);
              }}
            >
              Save
            </Button>
          </Col>
        </Row>

        <br />
        <Alert
          style={{ width: "450px" }}
          key={1}
          variant={this.state.flashVariant}
          show={this.state.showflashMessage}
          onClose={(event) =>
            this.centralEventHandler("onSaveAlertCloseHandler")
          }
          dismissible={true}
        >
          <div>{this.state.flashMessage}</div>
        </Alert>
      </div>
    )
  }



  iconDisplayPanelContent = () => {
    let accelerationImageSize = 60;
    let accelerationImageBorder = "#ffffff";

    let GyroImageSize = 60;
    let GyroImageBorder = "#ffffff";

    let OrientationImageSize = 60;
    let OrientationImageBorder = "#ffffff";

    let ComplementaryImageSize = 60;
    let ComplementaryImageBorder = "#ffffff";

    let MadgwickImageSize = 60;
    let MadgwickImageBorder = "#ffffff";

    switch (this.state.currentPanelContent) {
      case "acceleration":
        accelerationImageSize = 80;
        accelerationImageBorder = "solid 3px #373a3b";
        break;
      case "gyro":
        GyroImageSize = 80;
        GyroImageBorder = "solid 3px #373a3b";
        break;
      case "orientation":
        OrientationImageSize = 80;
        OrientationImageBorder = "solid 3px #373a3b";
        break;
      case "complementary":
        ComplementaryImageSize = 80;
        ComplementaryImageBorder = "solid 3px #373a3b";
        break;
      case "madgwick":
        MadgwickImageSize = 80;
        MadgwickImageBorder = "solid 3px #373a3b";
        break;
    }

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="2">
          <img
            src={accelerationImage}
            height={accelerationImageSize}
            width={accelerationImageSize}
            style={{ border: accelerationImageBorder }}
            name="acceleration"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>

        <Col sm="2">
          <img
            src={GyroImage}
            height={GyroImageSize}
            width={GyroImageSize}
            style={{ border: GyroImageBorder }}
            name="gyro"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>

        <Col sm="2">
          <img
            src={OrientationImage}
            height={OrientationImageSize}
            width={OrientationImageSize}
            style={{ border: OrientationImageBorder }}
            name="orientation"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>

        <Col sm="2">
          <img
            src={ComplementaryImage}
            height={ComplementaryImageSize}
            width={ComplementaryImageSize}
            style={{ border: ComplementaryImageBorder }}
            name="complementary"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>

        <Col sm="2">
          <img
            src={MadgwickImage}
            height={MadgwickImageSize}
            width={MadgwickImageSize}
            style={{ border: MadgwickImageBorder }}
            name="madgwick"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>
      </Row>
    );
  };

  pageViewPanelContent = () => {
    if (this.state.currentPanelContent === "acceleration") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.accelerationPanelContent()}
        </div>
      );
    } else if (this.state.currentPanelContent === "gyro") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.GyroPanelContent()}
        </div>
      );
    } else if (this.state.currentPanelContent === "orientation") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.OrientationPanelContent()}
        </div>
      );
    }
    else if (this.state.currentPanelContent === "complementary") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.ComplementaryPanelContent()}
        </div>
      )
    }
    else if (this.state.currentPanelContent === "madgwick") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.MadgwickPanelContent()}
        </div>
      )
    }
    else {
      return <div>{this.iconDisplayPanelContent()}</div>;
    }
  };

  // ========= Render ============
  render() {
    return (
      <div>
        {this.navbarInterface("Filters / Algorithm")}
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

export default connect(mapStateToProps, mapDispatchToProps)(IMUFilter);
