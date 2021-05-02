import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import NavigationBar from "../../UI/NavigationBar/NavigationBar";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import queryRemoveImage from "../../../assets/remove.png";
import queryTestImage from "../../../assets/check.png";
import queryImage from "../../../assets/addNew.png";

class queryManagerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onSaveAlert: false,
      dbList: [],
      queryList: [],
      NameInAdd: "",
      queryInAdd: "",
      periodicity: "0",
      NameInRemove: "",
      textContent: "",
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",
      currentPanelContent: "",
    };
  }

  componentDidMount() {
    
    const data = {
      operation: "queryList",
      id: this.props.user_id,
    };
    
    axios
      .get(this.props.server_address + `/uptime/database`, {
        params: data,
      })
      .then((response) => {
        if (response.data["status"] === "success") {
          this.setState({
            dbList: [...response.data["dbList"]],
            queryList: [...response.data["queryList"]],
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

  query = (queryString) => {
    if (this.props.influxdb_instance) {
      let queryOption = {
        precision: "u",
        retentionPolicy: "",
        database: "",
      };

      return this.props.influxdb_instance["instance"].query(
        queryString,
        queryOption
      );
    } else {
      return Promise.reject();
    }
  };

  write = (dataPoints) => {
    if (this.props.influxdb_instance) {
      return this.props.influxdb_instance["instance"].writePoints(
        ...dataPoints
      );
    } else {
      return Promise.reject();
    }
  };

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

  centralEventHandler = (option, event) => {
    switch (option) {
      case "name":
        this.setState({
          NameInAdd: event.target.value,
        });
        break;
      case "query":
        this.setState({
          queryInAdd: event.target.value,
        });
        break;
      case "periodicity":
        this.setState({
          periodicity: event.target.value,
        });
        break;
      case "querySelection":
        this.setState({
          NameInRemove: event.target.value,
        });
        break;
      case "add":
        let newQuery = {
          name: this.state.NameInAdd,
          query: this.state.queryInAdd,
          periodicity: this.state.periodicity,
        };
        this.setState({
          queryList: [...this.state.queryList, newQuery],
          NameInAdd: "",
          queryInAdd: "",
          periodicity: "",
        });

        //upload to the database
        setTimeout(() => {
          const data = {
            operation: "queryList",
            id: this.props.user_id,
            queryList: [...this.state.queryList],
          };
          axios
            .post(this.props.server_address + `/uptime/database`, data)
            .then((response) => {
              if (response.data["status"] === "success") {
                this.flashAlert("Query added successfully", "info");
              } else {
                this.flashAlert("Failed to add query", "danger");
              }
            })
            .catch((response) => {
              this.flashAlert("Failed to add query", "danger");
            });
        }, 1000);

        break;
      case "remove":
        //find the query in the query list
        let newQueryList = this.state.queryList.filter((item) => {
          return item["name"] !== this.state.NameInRemove;
        });

        this.setState({
          queryList: newQueryList,
        });

        //upload to the database
        setTimeout(() => {
          const data = {
            operation: "queryList",
            id: this.props.user_id,
            queryList: this.state.queryList,
          };
          axios
            .post(this.props.server_address + `/uptime/database`, data)
            .then((response) => {
              if (response.data["status"] === "success") {
                this.flashAlert("Query removed successfully", "info");
              } else {
                this.flashAlert("Failed to remove query", "danger");
              }
            })
            .catch((response) => {
              this.flashAlert("Failed to remove query", "danger");
            });
        }, 1000);
        break;
      case "test":
        this.query(this.state.queryInAdd)
          .then((response) => {
            let dataPointString = "";

            for (let i = 0; i < response.length; i++) {
              //Convert each data to string format and split it by "," into an array of string
              let dataPoint = String(Object.values(response[i])).split(",");

              //Convert the time stamp format to epoch and re-format as needed
              dataPoint[0] = Date.parse(dataPoint[0]);
              // dataPoint[0] = moment(dataPoint[0]).unix();
              dataPoint.map((item, index) => (dataPointString += item + ","));
              dataPointString += "\n";
            }
            this.setState({
              textContent: dataPointString,
            });
            console.log(dataPointString);
          })
          .catch((result) => {
            this.setState({
              textContent: "No results",
            });
          });
        break;

      case "iconClickHandler":
        switch (event.target.name) {
          case "addQuery":
            this.setState({
              currentPanelContent: "addQuery",
            });
            break;
          case "removeQuery":
            this.setState({
              currentPanelContent: "removeQuery",
            });
            break;
          case "testQuery":
            this.setState({
              currentPanelContent: "testQuery",
            });
            break;
        }
        break;

        default:
          break;
    }
  };

  redirectDBManagerPage = () => {
    setTimeout(() => {
      this.props.history.push({
        pathname: "/uptime/sense/device/dbmanager",
      });
    }, 3000);
  };

  queryAddPanelContent = () => (
    <Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="5">
        <Form.Label style={{ fontSize: "20px" }}>Add Query</Form.Label>
        <br />
        <br />
        <Row>
          <Col sm="8">
            <Form.Label>Query Name</Form.Label>

            <Form.Control
              placeholder="Enter alias for the query"
              type="text"
              name="name"
              onChange={(e) => {
                this.centralEventHandler("name", e);
              }}
              value={this.state.NameInAdd}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm="8">
            <Form.Label>Query String</Form.Label>

            <Form.Control
              placeholder="Enter query"
              type="text"
              name="query"
              onChange={(e) => {
                this.centralEventHandler("query", e);
              }}
              value={this.state.queryInAdd}
            />
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm="4">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(e) => {
                this.centralEventHandler("add", e);
              }}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  queryTestPanelContent = () => (
    <div>
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="5">
          <Form.Label style={{ fontSize: "20px" }}>Test Query</Form.Label>
          <br />
          <br />
          <Row>
            <Col sm="8">
              <Form.Label>Query String</Form.Label>
              <Form.Control
                placeholder="Enter query"
                type="text"
                name="query"
                onChange={(e) => {
                  this.centralEventHandler("query", e);
                }}
                value={this.state.queryInAdd}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <Button
                className="Button"
                style={{ backgroundColor: "#2997c2", width: "100px" }}
                onClick={(e) => {
                  this.centralEventHandler("test", e);
                }}
              >
                Test
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="3"></Col>
        <Col sm="5">
          <Form.Label>Query Result</Form.Label>
          <br />
          <Row>
            <Col sm="8">
              <Form.Control
                as="textarea"
                fontSize="10px"
                style={{ height: 200 }}
                value={this.state.textContent}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm="8">
              <Form.Label>{this.dbConnectionStatusPanelContent()}</Form.Label>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

  queryRemovePanelContent = () => (
    <Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="5">
        <Form.Label style={{ fontSize: "20px" }}>Remove Query</Form.Label>
        <br />
        <br />
        <Row>
          <Col sm="8">
            <Form.Label>Query Name</Form.Label>
            <Form.Control
              as="select"
              onClick={(e) => {
                this.centralEventHandler("querySelection", e);
              }}
            >
              {this.state.queryList.map((item, index) => {
                return <option>{Object.values(item["name"])}</option>;
              })}
            </Form.Control>
          </Col>
        </Row>

        <Row>
          <Col sm="4">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              onClick={(e) => {
                this.centralEventHandler("remove", e);
              }}
            >
              Remove
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  disconnectionAlertPanelContent = () => {
    if (this.state.onSaveAlert === false) {
      this.setState({
        onSaveAlert: true,
      });
    }

    return (
      <div>
        <Alert style={{ width: "600px" }} key={1} variant="danger" show={true}>
          <div>Database connection broken! </div>
        </Alert>
        <Alert style={{ width: "600px" }} key={1} variant="info" show={true}>
          <div>
            <p>Please connect to a database.</p>
            <p>Redirecting to Database Manager now ...</p>
          </div>
        </Alert>
        {this.redirectDBManagerPage()}
      </div>
    );
  };

  dbConnectionStatusPanelContent = () => {
    if (this.props.influxdb_instance !== null) {
      return (
        <div>
          <Row>
            <Col sm="8">
              <Form.Label style={{ fontSize: "16px" }}>
                Database: {this.props.influxdb_instance["name"]} Status: Active
              </Form.Label>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <Row>
            <Col sm="8">
              <Form.Label style={{ fontSize: "16px" }}>
                Database: {this.props.influxdb_instance["name"]} Status:
                Inactive
              </Form.Label>
            </Col>
          </Row>
        </div>
      );
    }
  };

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

  iconPanelContent = () => {
    let addImageSize = 60;
    let addImageBorder = "#ffffff";

    let removeImageSize = 60;
    let removeImageBorder = "#ffffff";

    let testImageSize = 60;
    let testImageBorder = "#ffffff";

    switch (this.state.currentPanelContent) {
      case "addQuery":
        addImageSize = 80;
        addImageBorder = "solid 3px #373a3b";
        break;
      case "removeQuery":
        removeImageSize = 80;
        removeImageBorder = "solid 3px #373a3b";
        break;
      case "testQuery":
        testImageSize = 80;
        testImageBorder = "solid 3px #373a3b";
        break;
    }

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="4">
          <img
            src={queryImage}
            name="addQuery"
            height={addImageSize}
            width={addImageSize}
            style={{ border: addImageBorder }}
            onClick={(event) => {
              this.centralEventHandler("iconClickHandler", event);
            }}
          />
        </Col>

        <Col sm="4">
          <img
            src={queryTestImage}
            name="testQuery"
            height={testImageSize}
            width={testImageSize}
            style={{ border: testImageBorder }}
            onClick={(event) => {
              this.centralEventHandler("iconClickHandler", event);
            }}
          />
        </Col>

        <Col sm="4">
          <img
            src={queryRemoveImage}
            name="removeQuery"
            height={removeImageSize}
            width={removeImageSize}
            style={{ border: removeImageBorder }}
            onClick={(event) => {
              this.centralEventHandler("iconClickHandler", event);
            }}
          />
        </Col>
      </Row>
    );
  };

  queryManagerPanelContent = () => {
    if (this.state.currentPanelContent === "addQuery") {
      return (
        <div>
          {this.iconPanelContent()}
          <br />
          <br />
          <br />
          {this.queryAddPanelContent()}
        </div>
      );
    } else if (this.state.currentPanelContent === "removeQuery") {
      return (
        <div>
          {this.iconPanelContent()}
          <br />
          <br />
          <br />
          {this.queryRemovePanelContent()}
        </div>
      );
    } else if (this.state.currentPanelContent === "testQuery") {
      return (
        <div>
          {this.iconPanelContent()}
          <br />
          <br />
          <br />
          {this.queryTestPanelContent()}
        </div>
      );
    } else {
      return <div>{this.iconPanelContent()}</div>;
    }
  };

  render() {
    if (this.props.influxdb_instance === null) {
      return (
        <div>
          {this.navbarInterface("Influx Query Manager")}
          <Container>
            {this.panelInterface("", this.disconnectionAlertPanelContent())}
          </Container>
          <Alert
            style={{ width: "500px", transitions: "fade" }}
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
    return (
      <div>
        {this.navbarInterface("Influx Query Manager")}
        <Container>
          {this.panelInterface("", this.queryManagerPanelContent())}
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

export default connect(mapStateToProps, mapDispatchToProps)(queryManagerPage);
