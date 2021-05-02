import React, { Component } from 'react'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card"
import { connect } from "react-redux";
import Alert from "react-bootstrap/Alert";

class HelpView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user_id: "",
        };
    }



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
                <NavigationBar userid={this.state.user_id} />

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

    // helpView = () => (
    //     <Row>
    //         <Col sm="10">
    //             <Card bg="dark" text="white">
    //                 <Card.Header style={{ fontSize: "28px" }}></Card.Header>
    //                 <Card.Body>
    //                     <Row>
    //                         <Col sm>
    //                             <Card.Text style={{ fontSize: "28px" }} >For help related UPTIME sense component,
    //                             Please contact adminstrator via e-mail mentioned below</Card.Text>
    //                         </Col>
    //                     </Row>
    //                 </Card.Body>
    //                 <Card.Body>
    //                     <Row>
    //                         <Col sm={2}>
    //                             <Card.Title style={{ fontSize: "24px" }}>Contact: </Card.Title>
    //                         </Col>
    //                         <Col sm>
    //                             <Card.Text style={{ fontSize: "20px" }}>admin@biba.uni-bremen.de</Card.Text>
    //                         </Col>
    //                     </Row>
    //                 </Card.Body>
    //             </Card>
    //         </Col>
    //     </Row>
    // )

        helpView = () => (
            
        <Row>
            <Form>
            <Col sm="28">
                <Row>
                    <Col sm>
                        <Form.Label style={{ fontSize: "28px" }} >For help, please contact adminstrator via e-mail mentioned below</Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <Form.Label style={{ fontSize: "24px" }}>Contact: </Form.Label>
                    </Col>
                    <Col sm>
                       <Form.Label style={{ fontSize: "20px" }}>admin@biba.uni-bremen.de</Form.Label>
                    </Col>
                </Row>
            </Col>
            </Form>
        </Row>
    )

    render() {
        return (
            <div>
                { this.navbarInterface("Help")}
                < Container > {this.panelInterface("", this.helpView())}</Container >
            </div >

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

export default connect(mapStateToProps, mapDispatchToProps)(HelpView);
