import React, { Component, useState } from "react";
import "./startPage.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import Heatmap from "react-heatmap-grid";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

class frequencyDomain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStatus: "start-page",

      device_id: null,
      analysis_select: "FFT",

      sense_parameter: "",
      tag_name: "",
      measurement_name: "",
      sampling_freq: "",
      window_size: "",
      overlap_size: "",
      startDate: new Date(),
      startDateISOString: "",
      endDate: new Date(),
      endDateISOString: "",
      showgraph: false,
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",
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

  FormChangeHandler = (event) => {
    switch (event.target.name) {
      case "device_id":
        this.setState({
          device_id: event.target.value,
          showgraph: false,
        });
        break;

      case "analysis_select":
        this.setState({
          analysis_select: event.target.value,
          showgraph: false,
        });
        break;

      case "sense_parameter":
        this.setState({
          sense_parameter: event.target.value,
          showgraph: false,
        });
        break;

      case "tag_name":
        this.setState({
          tag_name: event.target.value,
          showgraph: false,
        });
        break;

      case "measurement_name":
        this.setState({
          measurement_name: event.target.value,
          showgraph: false,
        });
        break;

      case "sampling_freq":
        this.setState({
          sampling_freq: event.target.value,
          showgraph: false,
        });
        break;

      case "window_size":
        this.setState({
          window_size: event.target.value,
          showgraph: false,
        });
        break;

      case "overlap_size":
        this.setState({
          overlap_size: event.target.value,
          showgraph: false,
        });
        break;
    }
  };

  buttonClickHandler = (event) => {
    switch (event.target.name) {
      case "start_page_back":
        this.props.history.push({
          pathname: "/uptime/home",
        });
        this.setState({
          showgraph: false,
        });
        break;

      case "back":
        this.setState({
          pageStatus: "start-page",
          showgraph: false,
          analysis_select: "FFT",
          device_id: null
        });
        break;

      case "back-graph":
        this.setState({
          showgraph: false,
        });
        break;

      case "analyse":
        this.setState({
          showgraph: false,
        });
        //get query list fron db using user id
        if (this.state.pageStatus === "FFT") {
          const data = {
            operation: "fft",
            id: this.props.user_id,
            device_id: this.state.device_id,
            sense_param: this.state.sense_parameter,
            tag_name: this.state.tag_name,
            measurement_param: this.state.measurement_name,
            device_id: this.state.device_id,
            start_time: this.state.startDateISOString,
            end_time: this.state.endDateISOString,
            sample_frequency: this.state.sampling_freq,
          };
          axios
            .get(
              this.props.server_address +
              `/uptime/sense/analyse/frequencydomain`,
              {
                params: data,
              }
            )
            .then((response) => {
              if (response.data["status"] === "success") {
                this.setState({
                  graphAxes_x: response.data["x"],
                  graphAxes_y: response.data["y"],
                  showgraph: true,
                });
              } else {
                this.flashAlert(response.data["reason"], "danger");
              }
            })
            .catch((response) => {
              this.flashAlert("Request error", "danger");
            });
        } else if (this.state.pageStatus === "Spectrogram") {
          const data = {
            operation: "spectrogram",
            id: this.props.user_id,
            device_id: this.state.device_id,
            sense_param: this.state.sense_parameter,
            tag_name: this.state.tag_name,
            measurement_param: this.state.measurement_name,
            device_id: this.state.device_id,
            start_time: this.state.startDateISOString,
            end_time: this.state.endDateISOString,
            window_size: this.state.window_size,
            overlap_size: this.state.overlap_size,
            sample_frequency: this.state.sampling_freq,
          };
          axios
            .get(
              this.props.server_address +
              `/uptime/sense/analyse/frequencydomain`,
              {
                params: data,
              }
            )
            .then((response) => {
              if (response.data["status"] === "success") {
                this.setState({
                  graphAxes_x: response.data["x"],
                  graphAxes_y: response.data["y"],
                  graphMagnitude: response.data["value"],
                  showgraph: true,
                });
              } else {
                this.flashAlert(response.data["reason"], "danger");
              }
            })
            .catch((response) => {
              this.flashAlert("Request error", "danger");
            });
        }

        break;

      case "proceed":
        if (this.state.device_id === null) {
          this.flashAlert("Need device id", "danger")
        } else {
          this.setState({
            pageStatus: this.state.analysis_select,
            showgraph: false,
          });
        }


        break;
    }
  };

  // ======== Central event handler ===============
  centralEventHandler = (option, event) => {
    switch (option) {
      case "FormChangeHandler":
        this.FormChangeHandler(event);
        break;

      case "buttonClickHandler":
        this.buttonClickHandler(event);
        break;

      case "dateChangeHandler":
        switch (event["name"]) {
          case "start_date":
            this.setState({
              startDate: event["date"],
              startDateISOString: moment(event["date"]).toISOString(),
            });
            break;

          case "end_date":
            this.setState({
              endDate: event["date"],
              endDateISOString: moment(event["date"]).toISOString(),
            });
            break;
        }
        break;
    }
  };
  // =========== Panels ================

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

  navbarInterface = (main_message, sub_message) => {
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
            <div style={{ fontSize: "14px" }}>{sub_message}</div>
          </Navbar.Brand>
          <Navbar.Brand
            style={{
              color: "white",
            }}
            className="mx-auto"
          >
            <div style={{ fontSize: "20px" }}>{main_message}</div>
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  };

  FFTSpectrogramCommomsSubPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Sense Parameter</Form.Label>
            <Form.Control
              placeholder="Enter Sense Parameter"
              type="text"
              value={this.state.sense_parameter}
              name="sense_parameter"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <Form.Label> Conditional </Form.Label>
            <Form.Control
              placeholder="Enter Condition (Optional)"
              type="text"
              value={this.state.tag_name}
              name="tag_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Measurement Name</Form.Label>
            <Form.Control
              placeholder="Enter Measurement Name"
              type="text"
              value={this.state.measurement_name}
              name="measurement_name"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <label>Sampling Frequency</label>
            <Form.Control
              type="number"
              placeholder="Enter Sampling Frequency"
              name="sampling_freq"
              value={this.state.sampling_freq}
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Start Time</Form.Label>
            <div>
              <DateTimePicker
                format="y-MM-dd h:mm:ss a"
                value={this.state.startDate}
                onChange={(event) =>
                  this.centralEventHandler("dateChangeHandler", {
                    date: event,
                    name: "start_date",
                  })
                }
              />
            </div>
          </Col>
          <br />
          <Col sm="4">
            <Form.Label>End Date</Form.Label>
            <div>
              <DateTimePicker
                format="y-MM-dd h:mm:ss a"
                value={this.state.endDate}
                onChange={(event) =>
                  this.centralEventHandler("dateChangeHandler", {
                    date: event,
                    name: "end_date",
                  })
                }
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  buttonSubPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              style={{ backgroundColor: "#2997C2" }}
              className="Button"
              name="back"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              Back
            </Button>
            <Button
              style={{ backgroundColor: "#2997C2" }}
              className="Button"
              name="analyse"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              Analyse
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
  windowOverlapSubPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="4">
            <Form.Label>Window Size</Form.Label>
            <Form.Control
              placeholder="Enter Window Size"
              type="number"
              value={this.state.window_size}
              name="window_size"
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
          <br />
          <Col sm="4">
            <label>Overlap Size</label>
            <Form.Control
              type="number"
              placeholder="Enter Overlap Size"
              name="overlap_size"
              value={this.state.overlap_size}
              onChange={(event) =>
                this.centralEventHandler("FormChangeHandler", event)
              }
            />
          </Col>
        </Row>
      </div>
    );
  };
  startPagePanelContent = () => {
    let FrequencyAnalysisParameterOption = ["FFT", "Spectrogram"];
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <br />
          <Col sm="5">
            <Row>
              <Col sm="8">
                <label>Device ID</label>
                <Form.Control
                  type="text"
                  placeholder="Enter Device ID"
                  name="device_id"
                  onChange={(e) => {
                    this.centralEventHandler("FormChangeHandler", e);
                  }}
                />
              </Col>
            </Row>
          </Col>
          <br />
          <Col sm="5">
            <Row>
              <Col sm="8">
                <Form.Label>Frequency Analysis Method</Form.Label>
                <Form.Control
                  as="select"
                  name="analysis_select"
                  onClick={(e) => {
                    this.centralEventHandler("FormChangeHandler", e);
                  }}
                >
                  {FrequencyAnalysisParameterOption.map((item, index) => {
                    return <option>{item}</option>;
                  })}
                </Form.Control>
              </Col>
            </Row>
            <br />
          </Col>
        </Row>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Button
              style={{ backgroundColor: "#2997c2" }}
              className="Button"
              name="start_page_back"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              Back
            </Button>
            <Button
              style={{ backgroundColor: "#2997c2" }}
              className="Button"
              name="proceed"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              Proceed
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
  FFTPanelContent = () => {
    return (
      <div>
        {this.FFTSpectrogramCommomsSubPanelContent()}
        {this.buttonSubPanelContent()}
      </div>
    );
  };
  SpectrogramPanelContent = () => {
    return (
      <div>
        {this.FFTSpectrogramCommomsSubPanelContent()}
        <br />
        {this.windowOverlapSubPanelContent()}
        {this.buttonSubPanelContent()}
      </div>
    );
  };

  frequencyMagPlot = (x, y) => {
    // convert x and y data to rechart format
    let dataPoints = [];

    let trimAxis = (arr) => {
      return arr.map((e, index) => e.toFixed(2));
    };

    let trimXaxis = trimAxis(x);
    let trimYaxis = y;//trimAxis(y);

    for (let i = 0; i < Math.min(trimXaxis.length, trimYaxis.length); i++) {
      if (trimXaxis[i] > 0) {
        dataPoints.push({ x: trimXaxis[i], y: trimYaxis[i] });
      }
    }

    if (dataPoints.length > 0) {
      return (
        <div>
          <br />
          <br />
          <br />
          <BarChart
            data={dataPoints}
            width={window.innerWidth / 2}
            height={window.innerHeight / 2}
            margin={{
              top: 10,
              right: 100,
              left: 30,
              bottom: 20,
            }}
          >
            <XAxis dataKey="x" label={{ value: "Frequency(Hz)", position: 'insideBottomRight', offset: -20 }} />
            <YAxis dataKey="y" label={{ value: "Normalized Magnitude", angle: -90, position: 'insideLeft', offset: -20 }} />
            <Tooltip />
            <Legend />

            <Bar dataKey="y" fill="#FF0000" />

          </BarChart>

        </div>
      );
    } else {
      <div></div>;
    }
  };

  spectrogramPlot = (x, y, value) => {
    const xLabelsVisibility = [];
    for (let i = 0; i < x.length; i++) {
      if (i % 2 === 0) {
        xLabelsVisibility[i] = true;
      } else {
        xLabelsVisibility[i] = true;
      }
    }

    const lastIndexCount = (arr) => arr.length - 1;
    const middleIndexCount = (arr) => {
      if (arr.lengthy % 2) {
        return arr.length / 2;
      } else {
        return (arr.length + 1) / 2;
      }
    };

    let trimYaxis = (arr) => {
      let first = 0;
      let last = lastIndexCount(arr);
      let middle = middleIndexCount(arr);
      return y.map((e, index) => {
        // if (index === first || index === last || index === middle) {
        if (index % 2) {
          return e.toFixed(2);
        } else {
          return " ";
        }
      });
    };

    let trimXaxis = (arr) => {
      return arr.map((e, index) => e.toFixed(0));
    };

    const min = Math.min(Math.min(y), Math.min(x))
    const max = Math.max(Math.max(y), Math.max(x))
    const yLabels = ["Frequency(Hz)"];

    return (
      <div>
        <Heatmap
          xLabels={trimXaxis(x)}
          yLabels={trimYaxis(y)}
          yLabelTextAlign="left"
          xLabelsLocation="top"
          squares={true}
          data={value}
          xLabelsVisibility={xLabelsVisibility}
          backgroundColor="#3239ff"
          onClick={(x, y) => alert(`Clicked ${x}, ${y},${value}`)}
          cellStyle={(background, value, min, max, data, x, y) => {
            const quaterMax = 0.25 * max
            const halfMax = 0.5 * max
            const threeQuaterMax = 0.75 * max
            const opacityMax = 1.2

            if (value < quaterMax) {
              return ({
                //background : blue rgb(9,65,242)
                background: `rgba(9, 65, 242, ${opacityMax - (quaterMax - value) / (quaterMax - min)})`,
                fontSize: "11px",
              })
            } else if (value < halfMax) {
              return ({
                //background : ocean green rgb(41, 222, 237)
                background: `rgba(41, 222, 237, ${opacityMax - (halfMax - value) / (halfMax - min)})`,
                fontSize: "11px",
              })
            } else if (value < threeQuaterMax) {
              return ({
                //background : yellow rgb(210, 237, 41)
                background: `rgba(210, 237, 41, ${opacityMax - (threeQuaterMax - value) / (threeQuaterMax - min)})`,
                fontSize: "11px",
              })
            } else {
              return ({
                //background : red rgb(237, 73, 41)
                background: `rgba(237, 73, 41, ${opacityMax - (max - value) / (max - min)})`,
                fontSize: "11px",
              })
            }

          }}
        />
      </div>
    );
  };

  // ========= Render ============
  render() {
    switch (this.state.pageStatus) {
      case "start-page":
        return (
          <div>
            {this.navbarInterface("Frequency Domain Analysis", "")}
            <Container>
              {this.panelInterface("", this.startPagePanelContent())}
            </Container>
          </div>
        );
        break;

      case "FFT":
        if (this.state.showgraph === true) {
          return (
            <div>
              {this.navbarInterface(
                "Fast Fourier Transform",
                "Frequency Domain Analysis"
              )}

              <Container>
                {this.frequencyMagPlot(
                  this.state.graphAxes_x,
                  this.state.graphAxes_y
                )}

              </Container>

              <Row style={{ width: "150%" }} className="ml-auto">
                <Col sm="8">
                  <Button
                    style={{ backgroundColor: "#2997c2" }}
                    className="Button"
                    name="back-graph"
                    onClick={(event) =>
                      this.centralEventHandler("buttonClickHandler", event)
                    }
                  >
                    Back
            </Button>{" "}

                </Col>
              </Row>

              {/* <Button
                style={{ backgroundColor: "#2997c2" }}
                className="Button"
                name="back-graph"
                onClick={(event) =>
                  this.centralEventHandler("buttonClickHandler", event)
                }
              >
                Back
              </Button> */}

              <br />
            </div>
          );
        } else {
          return (
            <div>
              {this.navbarInterface(
                "Fast Fourier Transform",
                "Frequency Domain Analysis"
              )}
              <Container>
                {this.panelInterface("", this.FFTPanelContent())}
              </Container>
            </div>
          );
        }
        break;

      case "Spectrogram":
        if (this.state.showgraph === true) {
          return (
            <div>
              {this.navbarInterface("Spectrogram", "Frequency Domain Analysis")}
              <Button
                style={{ backgroundColor: "#2997c2" }}
                className="Button"
                name="back-graph"
                onClick={(event) =>
                  this.centralEventHandler("buttonClickHandler", event)
                }
              >
                Back
                </Button>
              <Container>
                <br />
                {this.spectrogramPlot(
                  this.state.graphAxes_x,
                  this.state.graphAxes_y,
                  this.state.graphMagnitude
                )}

              </Container>
            </div>
          );
        } else {
          return (
            <div>
              {this.navbarInterface("Spectrogram", "Frequency Domain Analysis")}
              <Container>
                {this.panelInterface("", this.SpectrogramPanelContent())}
              </Container>
            </div>
          );
        }

        break;
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

export default connect(mapStateToProps, mapDispatchToProps)(frequencyDomain);
