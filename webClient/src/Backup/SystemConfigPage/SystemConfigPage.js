import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "./SystemConfigPage.css";

class systemConfigPage extends Component {
  state = {
    deviceid: this.props.location.state.deviceid,
  };

  render() {
    return (
      <div>
        <div className="FormGroup">
          <Form.Group controlId="formDeviceProperties">
            <Row className="Paragraph16" style={{ fontWeight: "bold" }}>
              <Col> Device Configuration (System Configurations)</Col>
            </Row>

            <Row className="Paragraph16">
              <Col sm lg="2">
                <Form.Label>Device UUID</Form.Label>
              </Col>
              <Col sm lg="2">
                {this.state.deviceid}
              </Col>
            </Row>

            <Row className="Paragraph16">
              <Col sm lg="2">
                <Form.Label>Device Type</Form.Label>
              </Col>
              <Col sm lg="2">
                <Form.Control
                  className="InputField"
                  type="Username"
                  placeholder="Enter Device Type"
                  maxLength="32"
                />
              </Col>
            </Row>

            <Row className="Paragraph16">
              <Col sm lg="2">
                <Form.Label>Network ID</Form.Label>
              </Col>
              <Col sm lg="2">
                <Form.Control
                  className="InputField"
                  type="Username"
                  placeholder="Enter Network ID"
                  maxLength="32"
                />
              </Col>
            </Row>

            <Row className="Paragraph16">
              <Col sm lg="2">
                <Form.Label>Description</Form.Label>
              </Col>
              <Col sm lg="2">
                <Form.Control
                  className="InputField"
                  type="Username"
                  placeholder="Enter Description"
                  maxLength="32"
                />
              </Col>
            </Row>
          </Form.Group>
        </div>
      </div>
    );
  }
}

export default systemConfigPage;
