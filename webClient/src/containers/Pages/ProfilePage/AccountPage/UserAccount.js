import React, { Component } from 'react'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import UserAccountView from "./UserAccountView"
import axios from "axios";
import { connect } from "react-redux";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import { Button, Container, Label } from "react-bootstrap";

class UserAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id: "",
            user_name: "",
            user_role: "",
            user_organization: "",
            user_department: "",
            user_email: "",
            showflashMessage: false,
            flashMessage: "",
            flashVariant: "info",
        };
    }

    componentDidMount() {

        axios
            .get(this.props.server_address + `/uptime/user/account`, {
                params: {
                    operation: "user_account",
                    user_id: this.props.user_id,
                },
            })
            .then((response) => {
                if (response.data["status"] === "success") {

                    this.setState({
                        user_id: response.data["user_id"],
                        user_name: response.data["user_name"],
                        user_role: response.data["user_role"],
                        user_department: response.data["user_dept"],
                        user_organization: response.data["user_org"],
                        user_email: response.data["user_email"],
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

    userView = () => (
        <UserAccountView
            user_name={this.state.user_name}
            user_organization={this.state.user_organization}
            user_department={this.state.user_department}
            user_role={this.state.user_role}
            user_email={this.state.user_email}
            history={this.props.history} />
    )

    render() {
        return (
            <div>
                {this.navbarInterface("User Information")}
                <Container>{this.panelInterface("", this.userView())}</Container>
                <Alert
                    style={{ width: "500px", transitions: "Fade" }}
                    key={1}
                    variant={this.state.flashVariant}
                    show={this.state.showflashMessage}
                    dismissible={true}
                >
                    {this.state.flashMessage}
                </Alert>
            </div >

        )
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

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);
