import React, { Component } from "react";
import { connect } from "react-redux";
import { loadList } from "../../scripts/networkActions.js";
import AddToListForm from "./AddToListForm.jsx";
import UnknownToolTip from "./UnknownToolTip.jsx";

class UnconnectedScanItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      editing: false,
      name: this.props.data.name,
      qty: this.props.data.qty,
      unit: this.props.data.unit,
      viewWarn: true
    };
  }
  handleInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.edit({
      name: this.state.name,
      qty: this.state.qty,
      unit: this.state.unit,
      id: this.props.data.id
    });
    this.setState({ editing: false });
  };
  setFocus = event => {
    //console.log("clicked on" + this.props.item);
    //event.preventDefault();
    this.setState({ selected: !this.state.selected });
  };
  toggleEdit = event => {
    this.setState({ editing: !this.state.editing });
  };
  removeItem = () => {
    this.props.delete(this.props.data);
  };
  setId = foodId => {
    //console.log("itemId", this.props.data.id);
    //console.log("foodId", foodId);
    this.props.itemId(this.props.data.id, foodId);
  };
  renderDetails = () => {
    if (this.state.editing) {
      return (
        <div>
          {(!this.props.data.known || this.state.known) && (
            <UnknownToolTip
              baseName={this.props.data.name}
              setId={this.setId}
            />
          )}
          <form>
            <div className="wrapper-edit-item">
              <input
                type="text"
                placeholder="Item Name"
                name="name"
                onChange={this.handleInput}
                className="input-list"
                value={this.state.name}
              />
              <input
                type="text"
                placeholder="amount"
                name="qty"
                onChange={this.handleInput}
                className="input-list"
                value={this.state.qty}
              />
              <input
                type="text"
                placeholder="units"
                name="units"
                onChange={this.handleInput}
                className="input-list"
                value={this.state.unit}
              />
            </div>
            <button onClick={this.handleSubmit}>Add</button>
          </form>
        </div>
      );
    }
    return (
      <div className="list-style">
        {!this.props.data.known && (
          <UnknownToolTip baseName={this.props.data.name} setId={this.setId} />
        )}
        {this.props.data.name}
        {this.props.data.qty > 1 && ": " + this.props.data.qty}
        {this.props.data.unit && " " + this.props.data.unit}
      </div>
    );
  };
  render = () => {
    //console.log(this.props.data);
    if (this.state.selected) {
      return (
        <div className="list-wrapper" onMouseLeave={this.setFocus}>
          {this.renderDetails()}
          <button onClick={this.removeItem} className="button-delete">
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

const ScanItem = connect()(UnconnectedScanItem);
export default ScanItem;
