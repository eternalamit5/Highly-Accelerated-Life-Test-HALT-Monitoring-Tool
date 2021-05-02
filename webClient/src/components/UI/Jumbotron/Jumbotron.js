import React, { Component } from "react";
import { Jumbotron as Jumbo, Container } from "react-bootstrap";
import styled from "styled-components";
// import matildaImage from "../../../assets/matilda.jpg";
import image from "../../../assets/electronic.jpg";

const Styles = styled.div`
  .jumbo {
    background: url(${image}) no-repeat fixed bottom;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center top;
    color: #efefef;
    height: 200px;
    position: relative;
    z-index: -2;
  }

  .overlay {
    background-color: #000;
    opacity: 0.7;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
`;

export const Jumbotron = (props) => {
  if (props.app_name === "UPTIME") {
    return (
      <Styles>
        <Jumbo fluid className="jumbo">
          <div className="overlay"></div>
          <Container>
            <h1>UPTIME</h1>
            <p>
              Unified predictive maintenance framework and an associated unified
              information system in order to enable the predictive maintenance
              strategy implementation in manufacturing industries.
              </p>
          </Container>
        </Jumbo>
      </Styles>
    )
  } else if (props.app_name === "MATILDA") {
    return (
      <Styles>
        <Jumbo fluid className="jumbo">
          <div className="overlay"></div>
          <Container>
            <h1>MATILDA</h1>
            <p>
              A HOLISTIC, INNOVATIVE FRAMEWORK FOR THE DESIGN, DEVELOPMENT AND
              ORCHESTRATION OF 5G-READY APPLICATIONS AND NETWORK SERVICES OVER
              SLICED PROGRAMMABLE INFRASTRUCTURE
              </p>
          </Container>
        </Jumbo>
      </Styles>
    )
  } else if (props.app_name === "HALT") {
    return (
      <Styles>
        <Jumbo fluid className="jumbo">
          <div className="overlay"></div>
          <Container>
            <h1>HALT</h1>
            <p>
              A STANDARD HALT STRESS SCREENING METHODOLOGY TO UNCOVER THE WEAK LINKS AND DESIGN FLAWS IN THE PRINTED CIRCUIT BOARDS (PCB) AGAINST MOTION STRESSES.
              {/* A standard HALT stress screening methodology to uncover the weak links and design flaws in the Printed Circuit Boards (PCB) against motion stresses. */}
            </p>
          </Container>
        </Jumbo>
      </Styles>
    )
  } else {
    return (
      <div>

      </div>
    )
  }

};
