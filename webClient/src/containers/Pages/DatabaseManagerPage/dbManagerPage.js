import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Container, Label } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { InfluxDB } from "influx";
import dbAddImage from "../../../assets/add-database.png";
import dbRemoveImage from "../../../assets/delete-database.png";
import dbConnectImage from "../../../assets/connect.png";

class dbManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      host: null,
      port: null,
      username: null,
      password: null,
      dbCollection: [],
      nameInConnection: "",
      nameInRemove: "",
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",
      currentPanelContent: "",
    };
  }

  componentDidMount() {
    axios
      .get(this.props.server_address + `/uptime/database`, {
        params: {
          operation: "all",
          id: this.props.user_id,
        },
      })
      .then((response) => {
        if (response.data["status"] === "success") {
          this.setState({
            dbCollection: [...response.data["dbList"]],
          });
        } else {
          this.flashAlert("Failed fetch data from web server", "danger");
          setTimeout(() => {
            this.props.history.push({
              pathname: "/uptime/error",
            });
          }, 4000);
        }
      })
      .catch((response) => {
        this.props.history.push({
          pathname: "/uptime/error",
        });
      });
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

  formValChange = (event) => {
    switch (event.target.name) {
      case "name":
        this.setState({
          name: event.target.value,
        });
        break;
      case "host":
        this.setState({
          host: event.target.value,
        });
        break;
      case "port":
        this.setState({
          port: event.target.value,
        });
        break;
      case "username":
        this.setState({
          username: event.target.value,
        });
        break;
      case "password":
        this.setState({
          password: event.target.value,
        });
        break;
      case "connection":
        this.setState({
          nameInConnection: event.target.value,
        });
        break;
      case "remove":
        this.setState({
          nameInRemove: event.target.value,
        });
        break;
    }
  };

  buttonClickHandler = (event) => {
    switch (event.target.name) {
      case "connect":
        if (this.props.influxdb_instance === null) {
          let selectedOption = this.state.dbCollection.find((item, index) => {
            return item["name"] === this.state.nameInConnection;
          });

          if (selectedOption) {
            let newInfluxdbConn = new InfluxDB({
              host: selectedOption["host"],
              port: selectedOption["port"],
              database: selectedOption["name"],
              username: selectedOption["username"],
              password: selectedOption["password"],
            });

            this.props.influxdbUpdate({
              instance: newInfluxdbConn,
              name: selectedOption["name"],
              host: selectedOption["host"],
              port: selectedOption["port"],
              username: selectedOption["username"],
              password: selectedOption["password"],
            });
          }
        }

        break;
      case "disconnect":
        if (this.props.influxdb_instance !== null) {
          let selectedOption = this.state.dbCollection.find((item, index) => {
            return item["name"] === this.props.influxdb_instance["name"];
          });
          if (selectedOption) {
            if (this.props.influxdb_instance) {
              delete this.props.influxdb_instance["instance"];
              this.props.influxdbUpdate(null);
            }
          }
        }
        break;
      case "add":
        let tempDBList = [
          {
            name: this.state.name,
            host: this.state.host,
            port: this.state.port,
            username: this.state.username,
            password: this.state.password,
          },
        ];
        if (this.state.dbCollection !== null) {
          tempDBList = [
            {
              name: this.state.name,
              host: this.state.host,
              port: this.state.port,
              username: this.state.username,
              password: this.state.password,
            },
            ...this.state.dbCollection,
          ];
        }

        const data_add_api = {
          operation: "databaseList",
          id: this.props.user_id,
          dbList: [...tempDBList],
        };

        setTimeout(() => {
          axios
            .post(this.props.server_address + `/uptime/database`, data_add_api)
            .then((response) => {
              if (response.data["status"] === "success") {
                this.setState({
                  dbCollection: [...response.data["dbList"]],
                });
                this.flashAlert("Database added successfully", "info");
              } else {
                this.flashAlert("Failed to add database", "danger");
              }
            })
            .catch((response) => {
              this.flashAlert("Failed to add database", "danger");
            });
        }, 1000);

        break;

      case "remove":
        let newDBList = this.state.dbCollection.filter((item) => {
          return item["name"] != this.state.nameInRemove;
        });

        if (this.props.influxdb_instance) {
          if (
            this.props.influxdb_instance["name"] === this.state.nameInRemove
          ) {
            delete this.props.influxdb_instance["instance"];
            this.props.influxdbUpdate(null);
          }
        }

        this.setState({
          dbCollection: newDBList,
        });

        const data_remove_api = {
          operation: "databaseList",
          id: this.props.user_id,
          dbList: this.state.dbCollection,
        }

        setTimeout(() => {
          axios
            .post(this.props.server_address + `/uptime/database`, data_remove_api)
            .then((response) => {
              if (response.data["status"] === "success") {
                this.setState({
                  dbCollection: [...response.data["dbList"]],
                });
                this.flashAlert("Database removed successfully", "info");
              } else {
                this.flashAlert("Failed to remove database", "danger");
              }
            })
            .catch((response) => {
              this.flashAlert("Failed to remove database", "danger");
            });
        }, 1000);
        break;
    }
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "formValChange":
        this.formValChange(event);
        break;
      case "buttonClickHandler":
        this.buttonClickHandler(event);
        break;
      case "iconClickHandler":
        this.iconClickHandler(event);
        break;
    }
  };

  iconClickHandler = (event) => {
    this.setState({
      currentPanelContent: event.target.name,
    });
  };

  addDatabasePanelContent = () => (
    <Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="6">
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Form.Label style={{ fontSize: "20px" }}>Add Database</Form.Label>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Row>
              <Col sm="8">
                <Form.Label style={{ marginTop: "10px", fontSize: "16px" }}>
                  Name
                </Form.Label>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Control
                  placeholder="Database name"
                  type="text"
                  name="name"
                  onChange={(event) => {
                    this.centralEventHandler("formValChange", event);
                  }}
                  value={this.state.name}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Row>
              <Col sm="8">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    width: "100px",
                    fontSize: "16px",
                  }}
                >
                  URL
                </Form.Label>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Control
                  placeholder="Database URL"
                  type="text"
                  name="host"
                  onChange={(event) => {
                    this.centralEventHandler("formValChange", event);
                  }}
                  value={this.state.host}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Row>
              <Col sm="8">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    width: "100px",
                    fontSize: "16px",
                  }}
                >
                  Port
                </Form.Label>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Control
                  placeholder="Database Port"
                  type="text"
                  name="port"
                  onChange={(event) => {
                    this.centralEventHandler("formValChange", event);
                  }}
                  value={this.state.port}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Row>
              <Col sm="8">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    width: "100px",
                    fontSize: "16px",
                  }}
                >
                  Username
                </Form.Label>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Control
                  placeholder="Database Username"
                  type="text"
                  name="username"
                  onChange={(event) => {
                    this.centralEventHandler("formValChange", event);
                  }}
                  value={this.state.username}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Row>
              <Col sm="8">
                <Form.Label
                  style={{
                    marginTop: "10px",
                    width: "100px",
                    fontSize: "16px",
                  }}
                >
                  Password
                </Form.Label>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Control
                  placeholder="Database Port"
                  type="password"
                  name="password"
                  onChange={(event) => {
                    this.centralEventHandler("formValChange", event);
                  }}
                  value={this.state.password}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="4">
            <Row>
              <Col sm="5">
                <Button
                  name="Connect"
                  className="Button"
                  style={{ backgroundColor: "#2997c2", width: "100px" }}
                  name="add"
                  onClick={(event) => {
                    this.centralEventHandler("buttonClickHandler", event);
                  }}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  removeDatabasePanelContent = () => (
    <Row Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="6">
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="8">
            <Form.Label style={{ fontSize: "20px" }}>
              Remove Database
            </Form.Label>
          </Col>
        </Row>
        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Row>
              <Col sm="8">
                <Form.Label>Database</Form.Label>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Control
                  as="select"
                  name="remove"
                  onClick={(e) => {
                    this.centralEventHandler("formValChange", e);
                  }}
                  value={this.state.nameInRemove}
                >
                  {this.dbNameSelector()}
                </Form.Control>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Button
                  className="Button"
                  style={{ backgroundColor: "#2997c2", width: "100px" }}
                  name="remove"
                  onClick={(e) => {
                    this.centralEventHandler("buttonClickHandler", e);
                  }}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  connectDatabasePanelContent = () => (
    <Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="6">
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="5">
            <Row>
              <Col sm="8">
                <Form.Label style={{ fontSize: "20px" }}>
                  Database Connection
                </Form.Label>
              </Col>
            </Row>
          </Col>
        </Row>

        <br />
        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2">
            <Row>
              <Col sm="8">
                <Form.Label style={{ fontSize: "16px" }}>Database</Form.Label>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Form.Control
                  as="select"
                  name="connection"
                  onClick={(e) => {
                    this.centralEventHandler("formValChange", e);
                  }}
                  value={this.state.nameInConnection}
                >
                  {this.dbNameSelector()}
                </Form.Control>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ width: "150%" }} className="ml-auto">
          <Col sm="2"></Col>
          <Col sm="4">
            <Row>
              <Col sm="8">
                <Button
                  name="Connect"
                  className="Button"
                  style={{ backgroundColor: "#2997c2", width: "100px" }}
                  name="connect"
                  onClick={(event) => {
                    this.centralEventHandler("buttonClickHandler", event);
                  }}
                >
                  Connect
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  disconnectDatabasePanelContent = () => {
    let dbConnectionName = "";
    if (this.props.influxdb_instance) {
      dbConnectionName = this.props.influxdb_instance["name"];
    }

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="6">
          <Row style={{ width: "150%" }} className="ml-auto">
            <Col sm="5">
              <Row>
                <Col sm="8">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Database Connection
                  </Form.Label>
                </Col>
              </Row>
            </Col>
          </Row>

          <br />
          <Row style={{ width: "150%" }} className="ml-auto">
            <Col sm="2">
              <Row>
                <Col sm="8">
                  <Form.Label style={{ fontSize: "16px" }}>Database</Form.Label>
                </Col>
              </Row>
            </Col>
            <Col sm="4">
              <Row>
                <Col sm="8">
                  <Form.Text style={{ fontSize: "16px", height: "20px" }}>
                    {dbConnectionName}
                  </Form.Text>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row style={{ width: "150%" }} className="ml-auto">
            <Col sm="2"></Col>
            <Col sm="4">
              <Row>
                <Col sm="8">
                  <Button
                    name="Connect"
                    className="Button"
                    style={{ backgroundColor: "#2997c2", width: "100px" }}
                    name="disconnect"
                    onClick={(event) => {
                      this.centralEventHandler("buttonClickHandler", event);
                    }}
                  >
                    Disconnect
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  iconDisplayPanelContent = () => {
    let addImageSize = 60;
    let addImageBorder = "#ffffff";

    let removeImageSize = 60;
    let removeImageBorder = "#ffffff";

    let connectImageSize = 60;
    let connectImageBorder = "#ffffff";

    switch (this.state.currentPanelContent) {
      case "dbAdd":
        addImageSize = 80;
        addImageBorder = "solid 3px #373a3b";
        break;
      case "dbRemove":
        removeImageSize = 80;
        removeImageBorder = "solid 3px #373a3b";
        break;
      case "dbConnect":
        connectImageSize = 80;
        connectImageBorder = "solid 3px #373a3b";
        break;
    }

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="4">
          <img
            src={dbAddImage}
            height={addImageSize}
            width={addImageSize}
            style={{ border: addImageBorder }}
            name="dbAdd"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>

        <Col sm="4">
          <img
            src={dbRemoveImage}
            height={removeImageSize}
            width={removeImageSize}
            style={{ border: removeImageBorder }}
            name="dbRemove"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>
        <Col sm="4">
          <img
            src={dbConnectImage}
            height={connectImageSize}
            width={connectImageSize}
            style={{ border: connectImageBorder }}
            name="dbConnect"
            onClick={(event) =>
              this.centralEventHandler("iconClickHandler", event)
            }
          />
        </Col>
      </Row>
    );
  };

  dbNameSelector = () => {
    if (this.state.dbCollection) {
      if (this.state.dbCollection.length > 0) {
        return this.state.dbCollection.map((item, index) => {
          return <option>{Object.values(item["name"]).join("")}</option>;
        });
      }
    } else {
      return <option></option>;
    }
  };

  dbManagerPanelContent = () => {
    if (this.props.influxdb_instance === null) {
      switch (this.state.currentPanelContent) {
        case "dbAdd":
          return (
            <div>
              {this.iconDisplayPanelContent()}
              <br />
              <br />
              <br />
              {this.addDatabasePanelContent()}
            </div>
          );
          break;
        case "dbRemove":
          return (
            <div>
              {this.iconDisplayPanelContent()}
              <br />
              <br />
              <br />
              {this.removeDatabasePanelContent()}
            </div>
          );
          break;
        case "dbConnect":
          return (
            <div>
              {this.iconDisplayPanelContent()}
              <br />
              <br />
              <br />
              {this.connectDatabasePanelContent()}
            </div>
          );
          break;
        default:
          return <div>{this.iconDisplayPanelContent()}</div>;
      }
    } else {
      switch (this.state.currentPanelContent) {
        case "dbAdd":
          return (
            <div>
              {this.iconDisplayPanelContent()}
              <br />
              <br />
              <br />
              {this.addDatabasePanelContent()}
            </div>
          );
          break;
        case "dbRemove":
          return (
            <div>
              {this.iconDisplayPanelContent()}
              <br />
              <br />
              <br />
              {this.removeDatabasePanelContent()}
            </div>
          );
          break;
        case "dbConnect":
          return (
            <div>
              {this.iconDisplayPanelContent()}
              <br />
              <br />
              <br />
              {this.disconnectDatabasePanelContent()}
            </div>
          );
          break;
        default:
          return <div>{this.iconDisplayPanelContent()}</div>;
      }
    }
  };

  panelInterface = (message, contents) => (
    <div>
      <Row>
        <Col sm="8">
          <Form.Group controlId="panel">
            <Form.Label
              style={{
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

  render() {
    if (this.props.influxdb_instance !== null) {
      return (
        <div>
          {this.navbarInterface("Database Manager")}
          <Container>
            {this.panelInterface("", this.dbManagerPanelContent())}
          </Container>
          <Alert
            style={{ width: "500px", transitions: "Fade" }}
            key={1}
            variant={this.state.flashVariant}
            show={this.state.showflashMessage}
            dismissible={true}
          >
            {this.state.flashMessage}
          </Alert>
        </div>
      );
    } else {
      return (
        <div>
          {this.navbarInterface("Database Manager")}
          <Container>
            {this.panelInterface("", this.dbManagerPanelContent())}
          </Container>
          <Alert
            style={{ width: "500px", transitions: "Fade" }}
            key={1}
            variant={this.state.flashVariant}
            show={this.state.showflashMessage}
            dismissible={true}
          >
            {this.state.flashMessage}
          </Alert>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
    server_address: state.server_address,
    influxdb_instance: state.influxdb_instance,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    influxdbUpdate: (val) =>
      dispatch({ type: "INFLUXDB_UPDATE", payload: val }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(dbManager);
