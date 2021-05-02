import React, { Component } from "react";
import NavigationBar from "../../../containers/UI/NavigationBar/NavigationBar";
import { Jumbotron } from "../../../components/UI/Jumbotron/Jumbotron";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  invalidUserHandler = () => {
    return <Link href="/uptime/home" />;
  };


  uptimeContents = () => (
    <Container>
      <h2>UPTIME VISION</h2>
      <br />
      <p style={{ textAlign: "justify" }}>
        UPTIME provides next-generation predictive maintenance aiming to
        optimize in-service efficiency, to self-improve over time and adapt
        to dynamic manufacturing environments. It proposes a novel
        predictive maintenance management model along with an associated
        information system. Unifying Operational Intelligence and Business
        Analytics for Next-generation Maintenance UPTIME unifies operational
        intelligence and business analytics in the context of Industry 4.0
        in order to provide visibility and insights into data and
        maintenance operations. This unification not only enables observing
        deviations in the manufacturing processes, but also predicting
        failures, deciding optimal maintenance plans and acting ahead of
        time, in a proactive way. With UPTIME, manufacturing firms are able
        to harness different technologies, data sources (e.g. sensors,
        SCADA, PLC, asset management systems) and expert knowledge in order
        to drive maintenance operations through better decisions.
    </p>
      <p></p>
      <p></p>
    </Container>
  )

  matildaContents = () => (
    <Container>
      <h2>MATILDA VISION</h2>
      <br />
      <p style={{ textAlign: "justify" }}>
        Add text here
    </p>
      <p></p>
      <p></p>
    </Container>
  )

  haltContents = () => (
    <Container>
      <h2>HALT VISION</h2>
      <br />
      <p style={{ textAlign: "justify" }}>
        Highly Accelerated Life Test (HALT) Profile aims a qualitative step stress testing methodology carried out to identify the design flaw and
        operating limits in the Printed Circuit Boards (PCB) design against the motion stresses through the methodology where pre-recorded real test profile
        data is provided as an input to HALT for stress screening.
    </p>
      <p></p>
      <p></p>
    </Container>
  )

  render() {
    if (this.props.app_name === "UPTIME") {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          {this.uptimeContents()}
        </div>
      );
    } else if (this.props.app_name === "MATILDA") {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          {this.matildaContents()}
        </div>
      );
    } else if (this.props.app_name === "HALT") {
      return (
        <div>
          <NavigationBar userid={this.props.user_id} />
          <Jumbotron app_name={this.props.app_name} />
          {this.haltContents()}
        </div>
      );
    } else {
      return;
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
