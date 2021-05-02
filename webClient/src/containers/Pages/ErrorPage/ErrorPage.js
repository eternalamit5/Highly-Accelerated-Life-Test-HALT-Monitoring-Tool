import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  redirectLogInPage = () => {
    setTimeout(() => {
      this.props.history.push({
        pathname: "/uptime/login",
      });
    }, 5000);
  };
  render() {
    return (
      <div>
        <Row>
          <Col sm="5">
            <Card>
              <Card.Body>Something went Wrong !</Card.Body>
              <Card.Body>
                Redirecting to Log-In page in 5 seconds. Try to Log-In again
              </Card.Body>
              <Card.Body>We apology for the inconvience</Card.Body>
            </Card>
            {this.redirectLogInPage()}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ErrorPage;
