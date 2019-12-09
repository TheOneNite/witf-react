import React, { Component } from "react";
import { connect } from "react-redux";
import { loadPantry } from "../../scripts/networkActions.js";

class UnconnectedAddToPantryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = async event => {
    event.preventDefault();
    let data = new FormData();
    let newItem = {
      name: this.state.name,
      qty: this.state.qty,
      unit: this.state.units
    };
    if (newItem.qty === undefined) {
      newItem.qty = 1;
    }
    newItem = [newItem];
    newItem = JSON.stringify(newItem);
    data.append("items", newItem);
    const res = await fetch("/pantry", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log("pantry add success");
      let newPantry = await loadPantry();
      if (newPantry.success) {
        this.props.dispatch({ type: "openPantry", pantry: newPantry.data });
      }
    }
    alert("error adding item to pantry");
  };
  render = () => {
    return (
      <div>
        <form>
          <div>
            <input
              type="text"
              placeholder="Item Name"
              name="name"
              onChange={this.handleInput}
              className="input-base"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="amount"
              name="qty"
              onChange={this.handleInput}
              className="input-base"
            />
            <input
              type="text"
              placeholder="units"
              name="units"
              onChange={this.handleInput}
              className="input-base"
            />
          </div>
          <button onClick={this.handleSubmit}>Add</button>
        </form>
      </div>
    );
  };
}

const AddToPantryForm = connect()(UnconnectedAddToPantryForm);

export default AddToPantryForm;
