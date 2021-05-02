import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";

const cubeAttrib = {
  accelerationX: 0,
  accelerationY: 0,
  accelerationZ: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  receivedMsg: 0,
};
const DEG_TO_RAD = 0.017453292519943295769236907684886

class cube3DNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceid: "101",
      playPause: "play",
      update_counter: true,
    };

    this.socket = new WebSocket("ws://127.0.0.1:1515/channel/telemetry");
    this.socket.onopen = (e) => {
      this.socket.send("Client connected");
    };

    this.socket.onmessage = (event) => {
      this.imuParser(event.data);
    };

    this.socket.onclose = (event) => {
      if (!event.wasClean) {
        alert("[close] Connection broken, unexpected");
      }
    };

    this.socket.onerror = (error) => {
      alert(`[error] ${error.message}`);
    };
  }

  centralEventHandler = (option, event) => {
    switch (option) {
      case "backButtonHandler":
        this.props.history.push({
          pathname: "/uptime/sense/device/status",
        });
        break;
      case "playPauseButtonHandler":
        if (this.state.playPause === "play") {
          this.setState({
            playPause: "pause"
          })
        } else {
          this.setState({
            playPause: "play"
          })
        }
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2.5, window.innerHeight / 2);
    this.mount.appendChild(renderer.domElement);
    var geometry = new THREE.BoxGeometry(1.5, 0.2, 0.8);
    var cubeMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0x660000, transparent: true, opacity: 1, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0xb30000, transparent: true, opacity: 1, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0x1a0000, transparent: true, opacity: 1, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 1, side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ color: 0xff9999, transparent: true, opacity: 1, side: THREE.DoubleSide }),
    ];
    // Create a MeshFaceMaterial, which allows the cube to have different materials on each face 
    var material = new THREE.MeshFaceMaterial(cubeMaterials);
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 3;
    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.z = cubeAttrib.rotateX * DEG_TO_RAD;
      cube.rotation.x = cubeAttrib.rotateY * DEG_TO_RAD;
      cube.rotation.y = 0;  //* DEG_TO_RAD
      console.log(`${cube.rotation.x}, ${cube.rotation.z}`);
      renderer.render(scene, camera);
    };
    animate();
  }

  componentWillUnmount() {
    this.socket.close();
  }

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
              {/* Device UUID: {this.state.device_id} */}
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


  degrees_to_radians = (degrees) => {
    var pi = Math.PI;
    return degrees * (pi / 180);
  };

  imuParser = (msg) => {
    if (this.state.playPause === "play") {
      cubeAttrib.receivedMsg = msg;
      let data = JSON.parse(msg);
      if (data["tags"]["DeviceID"] === this.state.deviceid &&
        data["measurement"] === "MotionSense") {
        cubeAttrib.accelerationX = data["fields"]["ACCX"];
        cubeAttrib.accelerationY = data["fields"]["ACCY"];
        cubeAttrib.accelerationZ = data["fields"]["ACCZ"];
        cubeAttrib.gyrx = data["fields"]["GYRX"];
        cubeAttrib.gyry = data["fields"]["GYRY"];
        cubeAttrib.gyrz = data["fields"]["GYRZ"];
        cubeAttrib.rotateX = parseFloat(data["fields"]["ROLL"]); //p
        cubeAttrib.rotateY = parseFloat(data["fields"]["PITCH"]);  //y
        cubeAttrib.rotateZ = parseFloat(data["fields"]["YAW"]);  //r
      }

      this.setState({
        update_telemetry: true
      })

    }
  };


  telemetryPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Form.Label>
              Acceleration (G)
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              X-Axis: {parseFloat(cubeAttrib.accelerationX).toFixed(2)}
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              Y-Axis: {parseFloat(cubeAttrib.accelerationY).toFixed(2)}
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              Z-Axis: {parseFloat(cubeAttrib.accelerationZ).toFixed(2)}
            </Form.Label>
          </Col>
        </Row>

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Form.Label>
              Gyroscope (degree/sec)
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              X-Axis: {parseFloat(cubeAttrib.gyrx).toFixed(2)}
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              Y-Axis: {parseFloat(cubeAttrib.gyry).toFixed(2)}
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              Z-Axis: {parseFloat(cubeAttrib.gyrz).toFixed(2)}
            </Form.Label>
          </Col>
        </Row>

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Form.Label>
              Orientation (degree)
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              X-Axis: {parseFloat(cubeAttrib.rotateX).toFixed(2)}
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              Y-Axis: {parseFloat(cubeAttrib.rotateY).toFixed(2)}
            </Form.Label>
          </Col>
          <Col sm="2">
            <Form.Label>
              Z-Axis: {parseFloat(cubeAttrib.rotateZ).toFixed(2)}
            </Form.Label>
          </Col>
        </Row>
        {this.buttonPanelContent()}
      </div>
    )
  }

  buttonPanelContent = () => {
    if (this.state.playPause === "play") {
      return (
        <div>
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
                  this.centralEventHandler("playPauseButtonHandler", event)
                }
              >
                Pause
              </Button>
            </Col>
          </Row>
        </div>
      )
    } else {
      return (
        <div>
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
                  this.centralEventHandler("playPauseButtonHandler", event)
                }
              >
                Play
              </Button>
            </Col>
          </Row>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.navbarInterface("Cube simulation")}
        <Container>
          <br />
          <br />
          <div ref={(ref) => (this.mount = ref)} />
          {this.panelInterface("", this.telemetryPanelContent("play"))}
        </Container>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
    server_address: state.server_address,
    websocket_address:state.websocket_address,
    influxdb_instance: state.influxdb_instance,
  };
};

export default connect(mapStateToProps)(cube3DNew);
