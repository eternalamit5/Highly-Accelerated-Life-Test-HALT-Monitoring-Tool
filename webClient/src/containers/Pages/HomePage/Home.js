import React, { Component } from "react";
import NavigationBar from "../../../containers/UI/NavigationBar/NavigationBar";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { Jumbotron } from "../../../components/UI/Jumbotron/Jumbotron";
import Card from "react-bootstrap/Card";
import uptimeArchitectureImage from "../../../assets/uptimeArchitecture.png";
import matildaArchitectureImage from "../../../assets/matildaArchitecture.jpg";
import haltArchitectureImage from "../../../assets/haltArchitecture.png";
import Col from "react-bootstrap/Col";
import CardGroup from "react-bootstrap/CardGroup";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  LoginButtonHandler = () => {
    this.props.history.push({
      pathname: "/uptime/login",
    });
  };

  RegisterButtonHandler = () => {
    this.props.history.push({
      pathname: "/uptime/register",
    });
  };

  uptimeContents = () => {
    if (this.props.user_id === null) {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          <Container>
            <Card className="text-center">
              <Card.Header style={{ backgroundColor: "#3facd6" }}>
                <strong style={{ color: "#ffffff" }}>
                  Welcome to UPTIME
                </strong>
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  General overview of the UPTIME Architecture
                </Card.Title>
                <Card.Img
                  variant="top"
                  style={{ width: "40rem" }}
                  src={uptimeArchitectureImage}
                />
                <Card.Text style={{ marginTop: "30px" }}>
                  Please Login or Register with our Platform
                </Card.Text>
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#2997c2" }}
                  onClick={this.LoginButtonHandler}
                >
                  Login
                </Button>{" "}
                {"  "}
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#2997c2" }}
                  onClick={this.RegisterButtonHandler}
                >
                  Register
                </Button>
              </Card.Body>
              <Card.Footer
                className="text-center footer-copyright"
                style={{ backgroundColor: "#3facd6" }}
              >
                <p
                  class="text-center footer-copyright"
                  style={{ color: "#fff" }}
                >
                  © 2020 Uptime | All Rights Reserved
                </p>
              </Card.Footer>
            </Card>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          <Container>
            <h2>UPTIME Architecture</h2>
            <br />
            <p style={{ textAlign: "justify" }}>
              The UPTIME Platform has been designed according to Systems
              Engineering principles to address both generic and specific user
              needs and technical requirements. The platform architecture
              accommodates different specific needs as demonstrated by its six
              main modules.
            </p>
            <p style={{ textAlign: "justify" }}>
              <b>UPTIME SENSE</b> Serves as modular data acquisition and
              manipulation components of the UPTIME Platform. The SENSE
              component captures data from a high variety of sources and cloud
              environments. It can connect to both analogue and digital data
              sources via numerous protocols, acquire data from these
              heterogeneous data sources, and integrate them towards a
              configurable data set. It is also capable of storing and
              intelligently handling and filtering the data acquired and can
              provide it to other subsequent UPTIME components in the form of
              sensor data streams for further analysis and processing. Moreover,
              it brings configurable diagnosis capabilities on the Edge, e.g.
              for real-time or off-the-grid applications.
            </p>
            <p style={{ textAlign: "justify" }}>
              <b>UPTIME DETECT</b> Aims to identify the topical state/condition
              of technical equipment by continuously observing sensor data
              streams. UPTIME_PREDICT includes abnormal behaviour of technical
              equipment and accordingly the classification of the condition
              state (simple example could be traffic light indication such as
              green, yellow red state). This is done by the possibility to
              orchestrate so‐called calculation flows based on diagnosis and
              prediction algorithms that are already built in the algorithmic
              framework of the tool or that are built on purpose by implementing
              a simple programming interface.
            </p>
            <p style={{ textAlign: "justify" }}>
              <b>UPTIME ANALYSE</b> Is a data analytics engine driven by the
              need to leverage manufacturers’ legacy data and operational data
              related to maintenance, and to extract and correlate relevant
              knowledge. The ANALYZE component is designed to handle
              data‐at‐rest which signify data collected from various sources and
              physically stored across different manufacturers’ information
              systems.
            </p>
            <p style={{ textAlign: "justify" }}>
              <b>UPTIME FMECA</b> Failure Modes Effects and Criticality
              Analysis, aims to assess failure impacts of a system components.
              The FMECA component starts from the identification of the failure
              modes (i.e. how something can break down or fail) associated to
              each system’s component of an equipment and analyse the impact of
              such failures on the whole system according to its physical and
              logical design.
            </p>
            <p style={{ textAlign: "justify" }}>
              <b>UPTIME DECIDE</b> On the basis of (near) real-time predictions
              about future failures that lay outside the “normal states space”,
              DECIDE is enacted online in order to generate proactive action
              recommendations, i.e. recommendations about optimal (perfect or
              imperfect) maintenance actions and the optimal times of proactive
              action implementation. To do this, it estimates when the Expected
              Maintenance Loss will be minimized.
            </p>
            <p style={{ textAlign: "justify" }}>
              <b>UPTIME VISUALIZE</b> Provides configurable visualization to
              save time analysing data and getting insights, to support decision
              making and develop new solutions.
            </p>
          </Container>
        </div>
      );
    }
  }


  matildaContents = () => {
    if (this.props.user_id === null) {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          <Container>
            <Card className="text-center">
              <Card.Header style={{ backgroundColor: "#3facd6" }}>
                <strong style={{ color: "#ffffff" }}>
                  Welcome to Matilda!
                </strong>
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  General overview of the MATILDA architecture
                </Card.Title>
                <Card.Img
                  variant="top"
                  style={{ width: "40rem" }}
                  src={matildaArchitectureImage}
                />
                <Card.Text style={{ marginTop: "30px" }}>
                  Please Login or Register with our Platform
                </Card.Text>
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#2997c2" }}
                  onClick={this.LoginButtonHandler}
                >
                  Login
                </Button>{" "}
                {"  "}
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#2997c2" }}
                  onClick={this.RegisterButtonHandler}
                >
                  Register
                </Button>
              </Card.Body>
              <Card.Footer
                className="text-center footer-copyright"
                style={{ backgroundColor: "#3facd6" }}
              >
                <p
                  class="text-center footer-copyright"
                  style={{ color: "#fff" }}
                >
                  © 2020 Matilda | All Rights Reserved© 2020
                </p>
              </Card.Footer>
            </Card>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          <Container>
            <h2>Matilda</h2>
            <p>
              MATILDA aims to devise and realize a radical shift in the
              development of software for 5G-ready applications, as well as
              virtual and physical network functions and network services,
              through the adoption of a unified programmability model, the
              definition of proper abstractions and the creation of an open
              development environment that may be used by application as well as
              network functions developers.
            </p>
            <p>
              Intelligent and unified orchestration mechanisms are going to be
              applied for the automated placement of the 5G-ready applications
              and the creation and maintenance of the required network slices.
              Deployment and runtime policies enforcement is provided through a
              set of optimisation mechanisms providing deployment plans based on
              high level objectives and a set of mechanisms supporting runtime
              adaptation of the application components and/or network functions
              based on policies defined on behalf of a services provider.{" "}
            </p>
            <p>
              Multi-site management of the cloud/edge computing and IoT
              resources is supported by a multi-site virtualized infrastructure
              manager, while the lifecycle management of the supported Virtual
              Network Functions Forwarding Graphs (VNF-FGs), as well as a set of
              network management activities, are provided by a multi-site NFV
              Orchestrator (NFVO).
            </p>
            <p>
              Network and application-oriented analytics and profiling
              mechanisms are supported based on real-time as well as a
              posteriori processing of the collected data from a set of
              monitoring streams.
            </p>
          </Container>
        </div>
      );
    }
  }


  haltContents = () => {
    if (this.props.user_id === null) {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          <Container>
            <Card className="text-center">
              <Card.Header style={{ backgroundColor: "#3facd6" }}>
                <strong style={{ color: "#ffffff" }}>
                  Welcome to HALT!
                </strong>
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  General overview of the HALT architecture
                </Card.Title>
                <Card.Img
                  variant="top"
                  style={{ width: "55rem" }}
                  src={haltArchitectureImage}
                />
                <Card.Text style={{ marginTop: "30px" }}>
                  Please Login or Register with our Platform
                </Card.Text>
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#2997c2" }}
                  onClick={this.LoginButtonHandler}
                >
                  Login
                </Button>{" "}
                {"  "}
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#2997c2" }}
                  onClick={this.RegisterButtonHandler}
                >
                  Register
                </Button>
              </Card.Body>
              <Card.Footer
                className="text-center footer-copyright"
                style={{ backgroundColor: "#3facd6" }}
              >
                <p
                  class="text-center footer-copyright"
                  style={{ color: "#fff" }}
                >
                  © 2020 HALT | All Rights Reserved© 2020
                </p>
              </Card.Footer>
            </Card>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          <Container>
            <h2>HALT</h2>
            <p style={{ textAlign: "justify" }}> Highly Accelerated Life Test (HALT) Profile aims a qualitative step stress testing methodology carried out to identify the design flaw and operating limits in the Printed Circuit Boards (PCB) design against the motion stresses through the methodology where pre-recorded real test profile data is provided as an input to HALT for stress screening.

</p>
            <p style={{ textAlign: "justify" }}>

              PCB product typically sees the motion stress profiles in the field and is the primary cause of most of the predominant failure modes. Therefore, Highly accelerated life testing in the initial stages of

              development of product manufacturing and testing is practical tools which

              will quickly create realistic PCB failures from which the designer learns root cause potentially implement corrective action, and optimizes the design to push PCB limits out as far as possible.

              

              Hence, based on these a HALT Profile has objectives to identifying Design Flaws where the aim is to find and eliminate the flaws to produce a robust PCB design and PCB housing. Moreover, it also helps in determining the Limits of Operations for both the operating limits and the destruct limits of the design. Thus, a properly executed HALT profile can provide benefits such as more robust PCB design, higher reliable delivered units, reduced screening costs, less rework prior to delivery and hence reducing overall lifecycle costs of PCB’s.
</p>
          </Container>
        </div>
      );
    }
  }

  render() {
    if (this.props.app_name === "UPTIME") {
      return (
        <div>
          {this.uptimeContents()}
        </div>
      )
    } else if (this.props.app_name === 'MATILDA') {
      return (
        <div>
          {this.matildaContents()}
        </div>
      )
    }
    else {
      return (
        <div>
          {this.haltContents()}
        </div>
      )
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
