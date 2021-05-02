import React, { Component } from "react";
import { Route } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./LogInPage.css";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import axios from "axios";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { Jumbotron } from "../../../components/UI/Jumbotron/Jumbotron";

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

class loginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWelcomeMsgAlertClosed: false,
      isRegisterMsgAlertClosed: false,
      isUsernamePasswordErrorClosed: true,
      user_name: "",
      user_password: "",
      user_id: null,
      isError: {
        user_name: "",
        user_password: "",
      },
    };
  }

  usernamePasswordErrorAlertClose = () => {
    this.setState({
      isUsernamePasswordErrorClosed: true,
    });
  };

  loginButtonHandler = () => {
    const data = {
      user_name: this.state.user_name,
      user_password: this.state.user_password,
      user_id: this.state.user_id,
    };

    axios
      .post(this.props.server_address + "/uptime/login", data)
      .then((response) => {
        console.log(response.data);
        if (response.data["status"] == "success") {
          this.setState({
            user_id: response.data["user_id"],
            isUsernamePasswordErrorClosed: true,
          });
          this.props.userIDUpdate(response.data["user_id"]);
          this.props.history.push({
            pathname: "/uptime/home",
          });
        } else {
          this.setState({
            isUsernamePasswordErrorClosed: false,
          });
          this.props.userIDUpdate(null);
        }
      });
  };

  CancelledHandler = () => {
    this.props.history.replace("/");
  };

  welcomeMsgAlertHandler = () => {
    this.setState({
      isWelcomeMsgAlertClosed: true,
    });
  };

  registerMsgAlertHandler = () => {
    this.setState({
      isRegisterMsgAlertClosed: true,
    });
  };

  UsernamePasswordErrorAlertHandler = () => {
    this.setState({
      isUsernamePasswordErrorClosed: true,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(this.state);
    } else {
      console.log("Form is invalid!");
    }
  };

  formValChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let isError = { ...this.state.isError };

    switch (name) {
      case "user_name":
        isError.user_name =
          value.length < 4 ? "Atleast 4 characaters required" : "";
        break;

      case "user_password":
        isError.user_password =
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


  uptimeContents = () =>{
    const { isError } = this.state;
    return (
      <div>
        <NavigationBar userid={null} />
        <Jumbotron app_name={this.props.app_name}/>
        <Container>
          <div className="PageInfo">
            <Alert
              style={{ width: "450px" }}
              key={1}
              variant="info"
              show={!this.state.isWelcomeMsgAlertClosed}
              onClose={this.welcomeMsgAlertHandler}
            >
              <div>Welcome to UPTIME Platform</div>
            </Alert>

            <Alert
              style={{ width: "450px" }}
              key={1}
              variant="danger"
              show={!this.state.isUsernamePasswordErrorClosed}
              onClose={this.UsernamePasswordErrorAlertHandler}
              dismissible={true}
            >
              <div>Incorrect Username or Password combination</div>
            </Alert>
            <p className="PageInfo"></p>
          </div>

          <form onSubmit={this.onSubmit} noValidate>
            <div className="form-group">
              <Col sm="5">
                <label>UserName</label>
                <input
                  type="text"
                  className={
                    isError.user_name.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="user_name"
                  placeholder="Enter Username"
                  onChange={this.formValChange}
                />
                {isError.user_name.length > 0 && (
                  <span className="invalid-feedback">{isError.user_name}</span>
                )}
              </Col>
            </div>
            <div className="form-group">
              <Col sm="5">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className={
                    isError.user_password.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="user_password"
                  onChange={this.formValChange}
                />
                {isError.user_password.length > 0 && (
                  <span className="invalid-feedback">
                    {isError.user_password}
                  </span>
                )}
              </Col>
            </div>

            <Col sm="5">
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.CancelledHandler}
              >
                Cancel
              </Button>{" "}
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.loginButtonHandler}
              >
                Login
              </Button>
              <p class="sign-up-note">
                Do not have an account yet?{" "}
                <a href="/uptime/register">
                  <strong style={{ color: "#2997c2" }}>Register now!</strong>
                </a>
              </p>
            </Col>
          </form>
        </Container>
      </div>
    );
  }

  matildaContents = () => {
    const { isError } = this.state;
    return (
      <div>
        <NavigationBar userid={null} />
        <Jumbotron app_name={this.props.app_name}/>
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
              show={!this.state.isUsernamePasswordErrorClosed}
              onClose={this.UsernamePasswordErrorAlertHandler}
              dismissible={true}
            >
              <div>Incorrect Username or Password combination</div>
            </Alert>
            <p className="PageInfo"></p>
          </div>

          <form onSubmit={this.onSubmit} noValidate>
            <div className="form-group">
              <Col sm="5">
                <label>UserName</label>
                <input
                  type="text"
                  className={
                    isError.user_name.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="user_name"
                  placeholder="Enter Username"
                  onChange={this.formValChange}
                />
                {isError.user_name.length > 0 && (
                  <span className="invalid-feedback">{isError.user_name}</span>
                )}
              </Col>
            </div>
            <div className="form-group">
              <Col sm="5">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className={
                    isError.user_password.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="user_password"
                  onChange={this.formValChange}
                />
                {isError.user_password.length > 0 && (
                  <span className="invalid-feedback">
                    {isError.user_password}
                  </span>
                )}
              </Col>
            </div>

            <Col sm="5">
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.CancelledHandler}
              >
                Cancel
              </Button>{" "}
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.loginButtonHandler}
              >
                Login
              </Button>
              <p class="sign-up-note">
                Do not have an account yet?{" "}
                <a href="/uptime/register">
                  <strong style={{ color: "#2997c2" }}>Register now!</strong>
                </a>
              </p>
            </Col>
          </form>
        </Container>
      </div>
    );
  }


  haltContents = () => {
    const { isError } = this.state;
    return (
      <div>
        <NavigationBar userid={null} />
        <Jumbotron app_name={this.props.app_name}/>
        <Container>
          <div className="PageInfo">
            <Alert
              style={{ width: "450px" }}
              key={1}
              variant="info"
              show={!this.state.isWelcomeMsgAlertClosed}
              onClose={this.welcomeMsgAlertHandler}
            >
              <div>Welcome to HALT Platform</div>
            </Alert>

            <Alert
              style={{ width: "450px" }}
              key={1}
              variant="danger"
              show={!this.state.isUsernamePasswordErrorClosed}
              onClose={this.UsernamePasswordErrorAlertHandler}
              dismissible={true}
            >
              <div>Incorrect Username or Password combination</div>
            </Alert>
            <p className="PageInfo"></p>
          </div>

          <form onSubmit={this.onSubmit} noValidate>
            <div className="form-group">
              <Col sm="5">
                <label>UserName</label>
                <input
                  type="text"
                  className={
                    isError.user_name.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="user_name"
                  placeholder="Enter Username"
                  onChange={this.formValChange}
                />
                {isError.user_name.length > 0 && (
                  <span className="invalid-feedback">{isError.user_name}</span>
                )}
              </Col>
            </div>
            <div className="form-group">
              <Col sm="5">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className={
                    isError.user_password.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="user_password"
                  onChange={this.formValChange}
                />
                {isError.user_password.length > 0 && (
                  <span className="invalid-feedback">
                    {isError.user_password}
                  </span>
                )}
              </Col>
            </div>

            <Col sm="5">
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.CancelledHandler}
              >
                Cancel
              </Button>{" "}
              <Button
                variant="primary"
                style={{ backgroundColor: "#2997c2" }}
                onClick={this.loginButtonHandler}
              >
                Login
              </Button>
              <p class="sign-up-note">
                Do not have an account yet?{" "}
                <a href="/uptime/register">
                  <strong style={{ color: "#2997c2" }}>Register now!</strong>
                </a>
              </p>
            </Col>
          </form>
        </Container>
      </div>
    );
  }

  render() {
    if(this.props.app_name === "UPTIME"){
      return(
        <div>
          {this.uptimeContents()}
        </div>
      )
    }else if(this.props.app_name === "MATILDA"){
      return(
        <div>
          {this.matildaContents()}
        </div>
      )
    }else if(this.props.app_name === "HALT"){
      return(
        <div>
          {this.haltContents()}
        </div>
      )
    }else{
      return(<div>

      </div>)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    app_name: state.app_name,
    user_id: state.user_id,
    server_address: state.server_address,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userIDUpdate: (id) => dispatch({ type: "USER_ID", payload: id }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(loginPage);
