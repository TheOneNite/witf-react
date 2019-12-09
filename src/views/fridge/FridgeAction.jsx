import React, { Component } from "react";
import { connect } from "react-redux";
import AddToFridgeForm from "./AddToFridgeForm.jsx";

class UnconnectedFridgeAction extends Component {
  constructor(props) {
    super(props);
    this.state = { addItem: false };
  }
  toggleAdd = event => {
    this.setState({ addItem: !this.state.addItem });
  };
  render = () => {
    return (
      <div>
        {this.state.addItem && <AddToFridgeForm />}
        <button className="food-button" onClick={this.toggleAdd}>
          +
        </button>
      </div>
    );
  };
}

const FridgeAction = connect()(UnconnectedFridgeAction);
export default FridgeAction;
