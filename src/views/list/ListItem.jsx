import React, { Component } from "react";
import { connect } from "react-redux";
import { loadList } from "../../scripts/networkActions.js";
import AddToListForm from "./AddToListForm.jsx";

class UnconnectedListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      editing: false,
      name: this.props.data.name,
      qty: this.props.data.qty,
      unit: this.props.data.unit
    };
  }

  setFocus = event => {
    //console.log("clicked on" + this.props.item);
    //event.preventDefault();
    this.setState({ selected: !this.state.selected });
  };
  toggleEdit = event => {
    this.setState({ editing: !this.state.editing });
  };
  removeItem = async () => {
    let data = new FormData();
    let item = JSON.stringify(this.props.data);
    data.append("item", item);
    const res = await fetch("/delete-list", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      let newList = await loadList();
      if (newList.success) {
        this.props.dispatch({ type: "openList", list: newList.data });
        return;
      }
    }
    alert("Error deleting item from list");
  };
  toFridge = async event => {
    let item = JSON.stringify([this.props.data]);
    let data = new FormData();
    data.append("items", item);
    const res = await fetch("/fridge", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    console.log(bod);
    bod = JSON.parse(bod);
    if (bod.success) {
      let listRes = await loadList();
      if (listRes.success) {
        this.removeItem();
        this.props.dispatch({ type: "openList", list: listRes.data });
        return;
      }
    }
    alert("Error pushing shopping to fridge");
  };
  renderDetails = () => {
    if (this.state.editing) {
      return (
        <form className="wrapper-edit-item">
          <input
            type="text"
            placeholder="Item Name"
            name="name"
            onChange={this.handleInput}
            className="input-list"
            value={this.state.name}
            size={15}
            maxWidth="40%"
          />
          <input
            type="text"
            placeholder="amount"
            name="qty"
            onChange={this.handleInput}
            className="input-list"
            value={this.state.qty}
            size={3}
            maxWidth="20%"
          />
          <input
            type="text"
            placeholder="units"
            name="units"
            onChange={this.handleInput}
            className="input-list"
            value={this.state.unit}
            size={3}
            maxWidth="20%"
          />
          <button onClick={this.handleSubmit} className="button-list">
            ✓
          </button>
        </form>
      );
    }
    return (
      <div className="list-style">
        {this.props.data.name}
        {this.props.data.qty > 1 && ": " + this.props.data.qty}
        {this.props.data.unit && " " + this.props.data.unit}
      </div>
    );
  };
  render = () => {
    if (this.state.selected) {
      return (
        <div className="list-wrapper" onMouseLeave={this.setFocus}>
          {this.renderDetails()}
          <button className="button-list" onClick={this.toFridge}>
            >
          </button>
          <button
            item={this.props.data}
            onClick={this.removeItem}
            className="button-delete"
          >
            X
          </button>
          <button onClick={this.toggleEdit} className="button-edit">
            {/*<img
              src="http://localhost:4000/editIcon.png"
              className="icon-button"
            />*/}
            E
          </button>
        </div>
      );
    }
    return (
      <div className="list-wrapper" onMouseEnter={this.setFocus}>
        {this.renderDetails()}
      </div>
    );
  };
}

const ListItem = connect()(UnconnectedListItem);
export default ListItem;
