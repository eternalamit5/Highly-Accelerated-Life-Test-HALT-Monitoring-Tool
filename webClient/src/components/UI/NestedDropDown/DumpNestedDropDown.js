import React, { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/Dropdown";
class NestedDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const submenu = () => {
      return (
        <Dropdown.Menu>
          <Dropdown.Item>Submenu1</Dropdown.Item>
          <Dropdown.Item>Another Submenu1</Dropdown.Item>
          <Dropdown.Item>Something Submenu1</Dropdown.Item>
        </Dropdown.Menu>
      );
    };

    return (
      <div>
        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </DropdownButton>
      </div>
    );
  }
}

export default NestedDropDown;
