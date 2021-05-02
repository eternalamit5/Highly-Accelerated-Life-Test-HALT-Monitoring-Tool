import React, { Component } from "react";
import { Route } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import axios from "axios";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";

const regExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

// Form validation
const formValid = ({ isError, ...rest }) => {
  let isValid = false;

  Object.values(isError).forEach((val) => {
    if (val.length > 0) {
      isValid = false;
    } else {
      isValid = true;
    }
  });

  Object.values(rest).forEach((val) => {
    if (val === null) {
      isValid = false;
    } else {
      isValid = true;
    }
  });

  return isValid;
};

//Registration Page Class
class RegistrationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      organization: "",
      department: "",
      role: "",
      id: null,
      isRegistrationErrorOccurred: false,
      reason: "",
      isError: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  }

  registrationErrorAlertHandler = () => {
    this.setState({
      isRegistrationErrorOccurred: false,
    });
  };

  //Cancel button press handler
  cancelButtonHandler = () => {
    this.props.history.push({
      pathname: "/",
    });
  };

  //Submit button press handler
  submitButtonHandler = () => {
    const { password, confirmPassword } = this.state;
    // perform all neccassary validations
    if (password !== confirmPassword) {
      alert("Passwords don't match");
    } else {
      const data = {
        user_name: this.state.name,
        user_role: this.state.role,
        user_org: this.state.organization,
        user_dept: this.state.department,
        user_password: this.state.password,
        user_email: this.state.email,
        user_id: this.state.id,
      };

      axios
        .post(this.props.server_address + "/uptime/registration", data)
        .then((response) => {
          if (response.data["status"] == "success") {
            this.setState({
              isRegistrationErrorOccurred: false,
              reason: "",
              user_id: response.data["user_id"],
            });
            this.props.history.push({
              pathname: "/uptime/login",
            });
          } else {
            this.setState({
              isRegistrationErrorOccurred: true,
              reason: response.data["reason"],
            });
          }
        });
    }
  };

  //on submission
  onSubmit = (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(this.state);
    } else {
      console.log("Form is invalid!");
    }
  };

  //Form validation for change
  formValChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let isError = { ...this.state.isError };

    switch (name) {
      case "name":
        isError.name = value.length < 4 ? "Atleast 1 characaters required" : "";
        break;
      case "organization":
        isError.name = value.length < 1 ? "Atleast 1 characaters required" : "";
        break;
      case "role":
        isError.name = value.length < 1 ? "Atleast 1 characaters required" : "";
        break;
      case "department":
        isError.name = value.length < 1 ? "Atleast 1 characaters required" : "";
        break;
      case "email":
        isError.email = regExp.test(value) ? "" : "Email address is invalid";
        break;
      case "password":
        isError.password =
          value.length < 4 ? "Atleast 4 characaters required" : "";
        break;
      case "confirmPassword":
        isError.confirmPassword =
          value.length < 4 ? "Atleast 4 characaters required" : "";
        break;
      default:
        break;
    }

    this.setState({
      isError,
      [name]: value,
    });
  };

  render() {
    const { isError } = this.state;

    return (
      <div>
        <NavigationBar userid={null} />
        <Container>
          <div className="PageInfo">
            <Alert
              style={{ width: "450px" }}
              key={1}
              variant="info"
              show={!this.state.isWelcomeMsgAlertClosed}
              onClose={this.welcomeMsgAlertHandler}
            >
              <div>Welcome to MATILDA Platform</div>
            </Alert>

            <Alert
              style={{ width: "450px" }}
              key={1}
              variant="danger"
              show={this.state.isRegistrationErrorOccurred}
              onClose={this.registrationErrorAlertHandler}
              dismissible={true}
            >
              <div>Registration failed</div>
              <div>{this.state.reason}</div>
            </Alert>

            <Alert
              style={{ width: "450px" }}
              key={1}
              variant="info"
              show={this.state.isRegistrationErrorOccurred}
              onClose={this.registrationErrorAlertHandler}
              dismissible={true}
            >
              <Alert.Link href="/uptime/login">Click here to login</Alert.Link>
            </Alert>

            <p className="PageInfo">Please Register to proceed with platform</p>
          </div>

          <form onSubmit={this.onSubmit} noValidate>
            <div className="form-group">
              <Col sm="6">
                <label>UserName</label>
                <input
                  type="text"
                  className={
                    isError.name.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="name"
                  placeholder="Enter Username"
                  onChange={this.formValChange}
                />
                {isError.name.length > 0 && (
                  <span className="invalid-feedback">{isError.name}</span>
                )}
              </Col>
            </div>
            <div className="form-group">
              <Col sm="6">
                <label>Role</label>

                <input
                  className={
                    isError.name.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  type="text"
                  name="role"
                  placeholder="Enter Department name"
                  onChange={this.formValChange}
                />
              </Col>
            </div>
            <div className="form-group">
              <Col sm="6">
                <label>Organization</label>
                <input
                  className={
                    isError.name.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  type="text"
                  name="organization"
                  placeholder="Enter Organization name"
                  onChange={this.formValChange}
                />
              </Col>
            </div>
            <div className="form-group">
              <Col sm="6">
                <label>Department</label>

                <input
                  className={
                    isError.name.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  type="text"
                  name="department"
                  placeholder="Enter Department name"
                  onChange={this.formValChange}
                />
              </Col>
            </div>
            <div className="form-group">
              <Col sm="6">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className={
                    isError.password.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="password"
                  onChange={this.formValChange}
                />
                {isError.password.length > 0 && (
                  <span className="invalid-feedback">{isError.password}</span>
                )}
              </Col>
            </div>
            <div className="form-group">
              <Col sm="6">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className={
                    isError.confirmPassword.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={this.formValChange}
                />
                {isError.confirmPassword.length > 0 && (
                  <span className="invalid-feedback">
                    {isError.confirmPassword}
                  </span>
                )}
              </Col>
            </div>
            <div className="form-group">
              <Col sm="6">
                <label>Email</label>
                <input
                  type="email"
                  className={
                    isError.email.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="email"
                  placeholder="Enter Email"
                  onChange={this.formValChange}
                />
                {isError.email.length > 0 && (
                  <span className="invalid-feedback">{isError.email}</span>
                )}
              </Col>
            </div>
            <Col sm="6">
              <Form.Text className="text-muted">
                *Data will not be shared or used for any purposes without your
                consent.
              </Form.Text>
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.cancelButtonHandler}
              >
                Cancel
              </Button>{" "}
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.submitButtonHandler}
              >
                Register
              </Button>{" "}
            </Col>
          </form>
        </Container>
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage);
