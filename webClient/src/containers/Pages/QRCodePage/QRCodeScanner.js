import React, { Component } from "react";
import QrReader from "react-qr-scanner";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { Form } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import { Button } from "react-bootstrap";

class qrcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: null,
      pageTransistion: "startScan",
    };
  }

  buttonClickHandler = (event) => {
    switch (event.target.name) {
      case "scanButtonHandler":
        this.setState({
          result: null,
          pageTransistion: "startScan",
        });
        break;
      case "endScanButtonHandler":
        this.setState({
          result: "No results",
          pageTransistion: "endScan",
        });
        break;
      case "backButtonHandler":
        this.props.history.push({
          pathname: "/uptime/home/",
        });
        break;
    }
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "buttonClickHandler":
        this.buttonClickHandler(event);
        break;
      case "errorHandler":
        <Alert
          style={{ width: "450px", fontSize: "16px" }}
          key={1}
          variant="info"
        >
          <div>Error occured while scanning: {event} </div>
        </Alert>;
        break;
      case "scanResult":
        if (event !== null) {
          this.setState({
            result: event,
          });
        }
        break;
    }
  };

  startReaderPanelContent = () => {
    const previewStyle = {
      height: 500,
      width: 500,
    };
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="3">
            <QrReader
              delay={this.state.delay}
              style={previewStyle}
              onError={(event) => {
                this.centralEventHandler("errorHandler", event);
              }}
              onScan={(event) => {
                this.centralEventHandler("scanResult", event);
              }}
            />
          </Col>
        </Row>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="3">
            <Form.Label style={{ fontSize: "16px" }}>
              Scanning ......{" "}
            </Form.Label>
          </Col>
        </Row>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="3">
            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="backButtonHandler"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              Back
            </Button>

            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="endScanButtonHandler"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              End Scan
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  endReaderPanelContent = () => {
    return (
      <div>
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="3">
            <Alert
              style={{ width: "450px", fontSize: "16px" }}
              key={1}
              variant="info"
            >
              <div>Scan ended ! </div>
            </Alert>
          </Col>
        </Row>

        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="3">
            <Form.Label
              style={{
                fontSize: "16px",
              }}
            >
              QR Code Text:
            </Form.Label>
            <Form.Text style={{ fontSize: "14px" }}>
              {this.state.result}
            </Form.Text>
          </Col>
        </Row>
        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="3">
            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="backButtonHandler"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              Back
            </Button>

            <Button
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              className="Button"
              name="scanButtonHandler"
              onClick={(event) =>
                this.centralEventHandler("buttonClickHandler", event)
              }
            >
              Scan
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
            }}
            className="mx-auto"
          >
            <div style={{ fontSize: "20px" }}>{message}</div>
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  };

  qrPanelContent = () => {
    if (this.state.result === null) {
      return <div>{this.startReaderPanelContent()}</div>;
    } else {
      return <div>{this.endReaderPanelContent()}</div>;
    }
  };

  render() {
    return (
      <div>
        {this.navbarInterface("QR Scanner")}
        <Container>{this.panelInterface("", this.qrPanelContent())}</Container>
      </div>
    );
  }
}

export default qrcodeScanner;
