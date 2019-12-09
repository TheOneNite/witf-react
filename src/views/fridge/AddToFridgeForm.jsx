import React, { Component } from "react";
import { connect } from "react-redux";
import { loadFridge } from "../../scripts/networkActions.js";

class UnconnectedAddToFridgeForm extends Component {
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
    const res = await fetch("/fridge", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log("fridge add success");
      let newFridge = await loadFridge();
      if (newFridge.success) {
        this.props.dispatch({ type: "openFridge", fridge: newFridge.data });
      }
    }
    alert("error adding item to fridge");
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

const AddToFridgeForm = connect()(UnconnectedAddToFridgeForm);

export default AddToFridgeForm;
