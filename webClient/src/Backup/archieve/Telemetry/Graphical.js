import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import queryManagerPage from "../Database/queryManagerPage";

const accel_gyro_data = [
  {
    name: "Page A",
    accel_x: 1,
    accel_y: 2,
    accel_z: 3,
    gyro_x: 1,
    gyro_y: 2,
    gyro_z: 3,
    time_ms: 2400,
  },
  {
    name: "Page A",
    accel_x: 1.3,
    accel_y: 2.2,
    accel_z: 3.9,
    gyro_x: 1.4,
    gyro_y: 2.7,
    gyro_z: 3.9,
    time_ms: 2400,
  },
  {
    name: "Page A",
    accel_x: 1.6,
    accel_y: 2.1,
    accel_z: 3.6,
    gyro_x: 1.53,
    gyro_y: 2.23,
    gyro_z: 3.13,
    time_ms: 2400,
  },
  {
    name: "Page A",
    accel_x: 1.1,
    accel_y: 2.9,
    accel_z: 3.99,
    gyro_x: 1.78,
    gyro_y: 2.69,
    gyro_z: 3.77,
    time_ms: 2400,
  },
];
const graphOption = ["Select", "Accelerometer", "Gyroscope", "Accel-Gyro"];

class Graphical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGraph: null,
    };
  }

  changeHandler = (event) => {
    this.setState({
      selectedGraph: event.target.value,
    });
  };

  accelerometerGraph = (show) => {
    if (show === true) {
      return (
        <Row>
          {/* <AreaGraph
            data={accel_gyro_data}
            x_datakey={"time_ms"}
            y_datakey={["accel_x"]}
            x_axis_description={"time in milliseconds"}
            y_axis_description={["x-Linear Accel.(G)"]}
            width={1200}
            height={250}
            color={["#8884d8"]}
            opacity={1}
            graphType={"Accelerometer"}
          />
          <AreaGraph
            data={accel_gyro_data}
            x_datakey={"time_ms"}
            y_datakey={["accel_y"]}
            x_axis_description={"time in milliseconds"}
            y_axis_description={["y-Linear Accel.(G)"]}
            width={1200}
            height={250}
            color={["#8884d8"]}
            opacity={1}
            graphType={"Accelerometer"}
          />
          <AreaGraph
            data={accel_gyro_data}
            x_datakey={"time_ms"}
            y_datakey={["accel_z"]}
            x_axis_description={"time in milliseconds"}
            y_axis_description={["z-Linear Accel.(G)"]}
            width={1200}
            height={250}
            color={["#8884d8"]}
            opacity={1}
            graphType={"Accelerometer"}
          /> */}
        </Row>
      );
    }
    return null;
  };

  gyroGraph = (show) => {
    if (show === true) {
      return (
        <Row>
          {/* <AreaGraph
            data={accel_gyro_data}
            x_datakey={"time_ms"}
            y_datakey={["gyro_x"]}
            x_axis_description={"time in milliseconds"}
            y_axis_description={["x-Angular Accel.(dps)"]}
            width={1200}
            height={250}
            color={["#8884d8"]}
            opacity={1}
            graphType={"Gyroscope"}
          />
          <AreaGraph
            data={accel_gyro_data}
            x_datakey={"time_ms"}
            y_datakey={["gyro_y"]}
            x_axis_description={"time in milliseconds"}
            y_axis_description={["y-Angular Accel.(dps)"]}
            width={1200}
            height={250}
            color={["#8884d8"]}
            opacity={1}
            graphType={"Gyroscope"}
          />
          <AreaGraph
            data={accel_gyro_data}
            x_datakey={"time_ms"}
            y_datakey={["gyro_z"]}
            x_axis_description={"time in milliseconds"}
            y_axis_description={["z-Angular Accel.(dps)"]}
            width={1200}
            height={250}
            color={["#8884d8"]}
            opacity={1}
            graphType={"Gyroscope"}
          /> */}
        </Row>
      );
    }
    return null;
  };

  accel_gyro_graph = (show) => {
    if (show === true) {
      return (
        <Row>
          {/* <AreaGraph
            data={accel_gyro_data}
            x_datakey={"time_ms"}
            y_datakey={[
              "accel_x",
              "accel_y",
              "accel_z",
              "gyro_x",
              "gyro_y",
              "gyro_z",
            ]}
            x_axis_description={"time in milliseconds"}
            y_axis_description={[
              "x-Linear Accel.(G)",
              "y-Linear Accel.(G)",
              "z-Linear Accel.(G)",
              "x-Angular Accel.(dps)",
              "y-Angular Accel.(dps)",
              "z-Angular Accel.(dps)",
            ]}
            width={1200}
            height={250}
            color={[
              "#8884d8",
              "#1234d8",
              "#6784d8",
              "#8984d8",
              "#888567",
              "#9974d8",
            ]}
            opacity={1}
            graphType={"Accel-Gyro"}
          /> */}
        </Row>
      );
    }
  };

  backButtonClickHandler = () => {
    this.props.history.push({
      pathname: "/uptime/sense/device/status",
    });
  };

  render() {
    return (
      <div>
        <Container>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Select Graphs</Form.Label>
            <Form.Control
              style={{ marginLeft: "-100px", width: "200px" }}
              as="select"
              onChange={this.changeHandler}
              value={this.state.selectedGraph}
            >
              {graphOption.map((item, index) => {
                return <option value={item}>{item}</option>;
              })}
            </Form.Control>
            <Row>
              <Col sm="4">
                <Button
                  className="Button"
                  onClick={this.backButtonClickHandler}
                >
                  Back
                </Button>
              </Col>
            </Row>
          </Form.Group>
          {this.accelerometerGraph(
            this.state.selectedGraph === "Accelerometer" ? true : false
          )}
          {this.gyroGraph(
            this.state.selectedGraph === "Gyroscope" ? true : false
          )}
          {this.accel_gyro_graph(
            this.state.selectedGraph === "Accel-Gyro" ? true : false
          )}
        </Container>
      </div>
    );
  }
}

export default Graphical;
