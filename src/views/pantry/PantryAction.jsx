import React, { Component } from "react";
import { connect } from "react-redux";
import AddToPantryForm from "./AddToPantryForm.jsx";

class UnconnectedPantryAction extends Component {
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
        {this.state.addItem && <AddToPantryForm />}
        <button className="food-button" onClick={this.toggleAdd}>
          +
        </button>
      </div>
    );
  };
}

const PantryAction = connect()(UnconnectedPantryAction);
export default PantryAction;
