import React, { Component } from 'react'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavigationBar from "../../../UI/NavigationBar/NavigationBar";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button";
const user_info = (props) => {


    const view_1 = () => (
        <Row>
            <Col sm="12">
                <Card bg="dark" text="white">
                    <Card.Header style={{ fontSize: "28px" }}>{props.user_name}</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col sm={3}>
                                <Card.Title style={{ fontSize: "24px" }}>Role</Card.Title>
                            </Col>
                            <Col sm>
                                <Card.Text style={{ fontSize: "20px" }}>{props.user_role}</Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Body>
                        <Row>
                            <Col sm={3}>
                                <Card.Title style={{ fontSize: "24px" }}>Organization</Card.Title>
                            </Col>
                            <Col sm>
                                <Card.Text style={{ fontSize: "20px" }}>{props.user_organization}</Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Body>
                        <Row>
                            <Col sm={3}>
                                <Card.Title style={{ fontSize: "24px" }}>Department</Card.Title>
                            </Col>
                            <Col sm>
                                <Card.Text style={{ fontSize: "20px" }}>{props.user_department}</Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Body>
                        <Row>
                            <Col sm={3}>
                                <Card.Title style={{ fontSize: "24px" }}>e-mail</Card.Title>
                            </Col>
                            <Col sm>
                                <Card.Text style={{ fontSize: "20px" }}>{props.user_email}</Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )

    const view_2 = () => (
        <Row>
            <Col sm="12">
                <Row>
                    <Col sm={3}>
                        <Form.Label style={{ fontSize: "20px" }}>Name</Form.Label>
                    </Col>
                    <Col sm>
                        <Form.Label style={{ fontSize: "20px" }}>{props.user_name}</Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <Form.Label style={{ fontSize: "20px" }}>Role</Form.Label>
                    </Col>
                    <Col sm>
                        <Form.Label style={{ fontSize: "20px" }}>{props.user_role}</Form.Label>
                    </Col>
                </Row>


                <Row>
                    <Col sm={3}>
                        <Form.Label style={{ fontSize: "20px" }}>Organization</Form.Label>
                    </Col>
                    <Col sm>
                        <Form.Label style={{ fontSize: "20px" }}>{props.user_organization}</Form.Label>
                    </Col>
                </Row>

                <Row>
                    <Col sm={3}>
                        <Form.Label style={{ fontSize: "20px" }}>Department</Form.Label>
                    </Col>
                    <Col sm>
                        <Form.Label style={{ fontSize: "20px" }}>{props.user_department}</Form.Label>
                    </Col>
                </Row>

                <Row>
                    <Col sm={3}>
                        <Form.Label style={{ fontSize: "20px" }}>e-mail</Form.Label>
                    </Col>
                    <Col sm>
                        <Form.Label style={{ fontSize: "20px" }}>{props.user_email}</Form.Label>
                    </Col>
                </Row>

            </Col>
        </Row>
    )
    return (
        view_2()
    );
}


export default user_info;
