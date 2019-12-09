import React, { Component } from "react";

class ShoppingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      qty: ""
    };
  }

  nameChangeHandler = event => {
    this.setState({ itemName: event.target.value });
  };

  qtyChangeHandler = event => {
    this.setState({ qty: event.target.value });
  };

  submitHandler = async event => {
    event.preventDefault();
    let data = new FormData();
    data.append("item", this.state.itemName);
    data.append("qty", this.state.qty);
    await fetch("/shop", { method: "POST", body: data });
    this.setState({ itemName: "", qty: "" });
    this.props.reload();
  };

  render = () => {
    return (
      <form onSubmit={this.submitHandler}>
        <div className="shop-form-style">
          <div className="shop-input-style">
            <input
              type="text"
              onChange={this.nameChangeHandler}
              value={this.state.itemName}
              placeholder="Item"
              className="text-box"
            ></input>
            <input
              type="text"
              onChange={this.qtyChangeHandler}
              value={this.state.qty}
              placeholder="quantity"
              className="text-box"
            ></input>
          </div>
          <input type="submit" className="button-style"></input>
        </div>
      </form>
    );
  };
}

export default ShoppingForm;
