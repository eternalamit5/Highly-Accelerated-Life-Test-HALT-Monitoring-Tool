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
import removeDashboardImage from "../../../assets/remove.png";
import viewDashboardImage from "../../../assets/check.png";
import addDashboardImage from "../../../assets/addNew.png";

class dashboardManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onSaveAlert: false,
      currentDBConnection: null,
      dashboardList: [],
      nameInAdd: "",
      urlInAdd: "",
      nameInRemove: "",
      nameInView: "",
      urlInView: null,
      showflashMessage: false,
      flashMessage: "",
      flashVariant: "info",
      currentPanelContent: "",
    };
  }

  componentDidMount() {
    //get query list fron db using user id
    const data = {
      operation: "dashboardList",
      id: this.props.user_id,
    };
    axios
      .get(this.props.server_address + `/uptime/database`, {
        params: data,
      })
      .then((response) => {
        if (response.data["status"] === "success") {
          this.setState({
            dashboardList: [...response.data["dashboardList"]],
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

  addEventHandler = (event) => {
    switch (event.target.name) {
      case "name":
        this.setState({
          nameInAdd: event.target.value,
        });
        break;
      case "url":
        this.setState({
          urlInAdd: event.target.value,
        });
        break;
      case "addButton":
        this.setState({
          dashboardList: [
            ...this.state.dashboardList,
            {
              name: this.state.nameInAdd,
              url: this.state.urlInAdd,
            },
          ],
        });

        //upload to the database
        setTimeout(() => {
          const data = {
            operation: "dashboardList",
            id: this.props.user_id,
            dashboardList: [...this.state.dashboardList],
          };
          axios
            .post(this.props.server_address + `/uptime/database`, data)
            .then((response) => {
              this.flashAlert("Dashboard added successfully ", "info");
            })
            .catch((response) => {
              this.flashAlert("Failed to add dashboard", "danger");
            });
        }, 1000);

        break;
    }
  };

  removeEventHandler = (event) => {
    switch (event.target.name) {
      case "name":
        this.setState({
          nameInRemove: event.target.value,
        });
        break;
      case "removeButton":
        //find the query in the query list
        let newDashboardList = this.state.dashboardList.filter((item) => {
          return item["name"] != this.state.nameInRemove;
        });

        this.setState({
          dashboardList: newDashboardList,
        });

        //upload to the database
        setTimeout(() => {
          const data = {
            operation: "dashboardList",
            id: this.props.user_id,
            dashboardList: this.state.dashboardList,
          };
          axios
            .post(this.props.server_address + `/uptime/database`, data)
            .then((response) => {
              this.flashAlert("Dashboard removed successfully", "info");
            })
            .catch((response) => {
              this.flashAlert("Failed to delete dashboard", "danger");
            });
        }, 1000);
        break;
    }
  };

  viewEventHandler = (event) => {
    switch (event.target.name) {
      case "name":
        this.setState({
          nameInView: event.target.value,
        });
        break;
      case "viewButton":
        //find the query in the query list
        let board = this.state.dashboardList.find((item) => {
          return item["name"] == this.state.nameInView;
        });
        if (board) {
          this.setState({
            urlInView: board["url"],
          });
        } else {
          this.setState({
            urlInView: null,
          });
        }

        break;
    }
  };

  centralEventHandler = (option, event) => {
    switch (option) {
      case "addEventHandler":
        this.addEventHandler(event);
        break;
      case "removeEventHandler":
        this.removeEventHandler(event);
        break;
      case "viewEventHandler":
        this.viewEventHandler(event);
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

  showView = () => {
    if (this.state.urlInView !== null) {
      return (
        <Row style={{ width: "150%" }} className="ml-auto">
          <iframe
            src={this.state.urlInView}
            width="1000"
            height="400"
            frameborder="0"
          ></iframe>
        </Row>
      );
    }
  };

  dashboardAddPanelContent = () => (
    <Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="4">
        <Form.Label style={{ fontSize: "20px" }}>Add Dashboard</Form.Label>
        <br />
        <br />
        <Row>
          <Col sm="8">
            <Form.Label>Dashboard Name</Form.Label>

            <Form.Control
              placeholder="Enter Name"
              type="text"
              name="name"
              onChange={(e) => {
                this.centralEventHandler("addEventHandler", e);
              }}
              value={this.state.nameInAdd}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm="8">
            <Form.Label>Dashboard URL</Form.Label>

            <Form.Control
              placeholder="Enter URL"
              type="text"
              name="url"
              onChange={(e) => {
                this.centralEventHandler("addEventHandler", e);
              }}
              value={this.state.queryInAdd}
            />
          </Col>
        </Row>

        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              name="addButton"
              onClick={(e) => {
                this.centralEventHandler("addEventHandler", e);
              }}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  dashboardRemovePanelContent = () => (
    <Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="4">
        <Form.Label style={{ fontSize: "20px" }}>Remove Dashboard</Form.Label>
        <br />
        <br />
        <Row>
          <Col sm="8">
            <Form.Label>Dashboard Name</Form.Label>
            <Form.Control
              as="select"
              name="name"
              onClick={(e) => {
                this.centralEventHandler("removeEventHandler", e);
              }}
            >
              {this.state.dashboardList.map((item, index) => {
                return <option>{Object.values(item["name"])}</option>;
              })}
            </Form.Control>
          </Col>
        </Row>

        <Row>
          <Col sm="8">
            <Button
              className="Button"
              style={{ backgroundColor: "#2997c2", width: "100px" }}
              name="removeButton"
              onClick={(e) => {
                this.centralEventHandler("removeEventHandler", e);
              }}
            >
              Remove
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  dashboardViewPanelContent = () => (
    <Row style={{ width: "150%" }} className="ml-auto">
      <Col sm="3"></Col>
      <Col sm="4">
        <Form.Label style={{ fontSize: "20px" }}>View Dashboard</Form.Label>
        <br />
        <br />
        <Form.Label>Dashboard Name</Form.Label>
        <Form.Control
          as="select"
          name="name"
          onClick={(e) => {
            this.centralEventHandler("viewEventHandler", e);
          }}
        >
          {this.state.dashboardList.map((item, index) => {
            return <option>{Object.values(item["name"])}</option>;
          })}
        </Form.Control>

        <Button
          className="Button"
          style={{ backgroundColor: "#2997c2", width: "100px" }}
          name="viewButton"
          onClick={(e) => {
            this.centralEventHandler("viewEventHandler", e);
          }}
        >
          View
        </Button>
      </Col>
    </Row>
  );

  iconDisplayPanelContent = () => {
    let addImageSize = 60;
    let addImageBorder = "#ffffff";

    let removeImageSize = 60;
    let removeImageBorder = "#ffffff";

    let viewImageSize = 60;
    let viewImageBorder = "#ffffff";

    switch (this.state.currentPanelContent) {
      case "addDashboard":
        addImageSize = 80;
        addImageBorder = "solid 3px #373a3b";
        break;
      case "removeDashboard":
        removeImageSize = 80;
        removeImageBorder = "solid 3px #373a3b";
        break;
      case "viewDashboard":
        viewImageSize = 80;
        viewImageBorder = "solid 3px #373a3b";
        break;
    }

    return (
      <Row style={{ width: "150%" }} className="ml-auto">
        <Col sm="4">
          <img
            src={addDashboardImage}
            name="addDashboard"
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
            src={viewDashboardImage}
            name="viewDashboard"
            height={viewImageSize}
            width={viewImageSize}
            style={{ border: viewImageBorder }}
            onClick={(event) => {
              this.centralEventHandler("iconClickHandler", event);
            }}
          />
        </Col>

        <Col sm="4">
          <img
            src={removeDashboardImage}
            name="removeDashboard"
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

  dashboardPanelContent = () => {
    if (this.state.currentPanelContent === "addDashboard") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.dashboardAddPanelContent()}
        </div>
      );
    } else if (this.state.currentPanelContent === "removeDashboard") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.dashboardRemovePanelContent()}
        </div>
      );
    } else if (this.state.currentPanelContent === "viewDashboard") {
      return (
        <div>
          {this.iconDisplayPanelContent()}
          <br />
          <br />
          <br />
          {this.dashboardViewPanelContent()}
          <br />
          <br />
          {this.showView()}
        </div>
      );
    } else {
      return <div>{this.iconDisplayPanelContent()}</div>;
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

  render() {
    return (
      <div>
        {this.navbarInterface("Dashboard Manager")}
        <Container>
          {this.panelInterface("", this.dashboardPanelContent())}
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

export default connect(mapStateToProps)(dashboardManager);
