import React from "react";
import Form from "react-bootstrap/Form";
import ReactInterval from "react-interval";

class BootstrapTextarea extends React.Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      count: 0,
    };

    // this.handleInputChange = this.handleInputChange.bind(this);
  }

  //   handleInputChange(event) {
  //     let temp = [...this.state.messages];
  //     temp.push(event.target.value);
  //     this.setState({
  //       messages: temp,
  //     });

  //     console.warn(this.state.messages);
  //   }

  updateText() {
    let temp = [...this.state.messages];
    if (temp.length > this.props.maxNumMessages) {
      temp.splice(0, 1);
    }
    temp.push(String(this.state.count));
    let tempCount = this.state.count + 1;
    this.setState({
      messages: temp,
      count: tempCount,
    });

    console.warn(this.state.count);
  }

  componentDidMount() {
    this.updateText();
  }

  render() {
    return (
      <div>
        <ReactInterval
          timeout={1000}
          enabled={true}
          callback={() => this.updateText}
        />
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Example textarea</Form.Label>

            <Form.Control
              as="textarea"
              rows="3"
              name="messages"
              //   onChange={this.handleInputChange}
              value={this.state.messages}
            />
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default BootstrapTextarea;
