import React, { Component } from "react";
import { connect } from "react-redux";
import { loadList } from "../../scripts/networkActions.js";

class UnconnectedAddToListForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      qty: this.props.qty,
      units: this.props.unit
    };
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
    data.append("neededOnly", false);
    const res = await fetch("/list", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log("list add success");
      if (this.props.fromFrg) {
        this.props.fromFrg();
      }
      let listRes = await loadList();
      if (listRes.success) {
        this.props.dispatch({ type: "openList", list: listRes.data });
        return;
      }
    }
    alert("error adding item to list");
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
              className="input-unit"
              value={this.state.name}
            />
          </div>
          <div className="wrapper-input-unit">
            <input
              type="text"
              placeholder="amount"
              name="qty"
              onChange={this.handleInput}
              className="input-unit"
              value={this.state.qty}
            />
            <input
              type="text"
              placeholder="units"
              name="units"
              onChange={this.handleInput}
              className="input-unit"
              value={this.state.units}
            />
          </div>
          <button onClick={this.handleSubmit} className="button-list-add">
            Add
          </button>
        </form>
      </div>
    );
  };
}

const AddToListForm = connect()(UnconnectedAddToListForm);

export default AddToListForm;
