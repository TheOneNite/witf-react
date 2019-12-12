import React, { Component } from "react";
import { connect } from "react-redux";
import AddToFridgeForm from "./AddToFridgeForm.jsx";

class UnconnectedFridgeAction extends Component {
  constructor(props) {
    super(props);
    this.state = { addItem: true };
  }
  toggleAdd = event => {
    this.setState({ addItem: !this.state.addItem });
  };
  inputHandler = event => {
    this.setState({ searchQ: event.target.value }, () => {
      this.props.dispatch({ type: "search", query: this.state.searchQ });
    });
  };
  render = () => {
    return (
      <div>
        {this.state.addItem && <AddToFridgeForm />}
        <button className="food-button" onClick={this.toggleAdd}>
          +
        </button>
        <input
          type="text"
          className="input-fridge-search"
          value={this.state.searchQ}
          onChange={this.inputHandler}
          placeholder="search"
        />
      </div>
    );
  };
}

const FridgeAction = connect()(UnconnectedFridgeAction);
export default FridgeAction;
