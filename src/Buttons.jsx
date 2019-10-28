import React, { Component } from "react";

class MenuButton extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <button className="main-button" onClick={this.props.onClick}>
        {this.props.displayText}
      </button>
    );
  };
}

class PurchaseButton extends Component {
  constructor(props) {
    super(props);
  }

  buyItems = async () => {
    console.log("pushing shopping to fridge");
    let purchaseJSON = JSON.stringify(this.props.list);
    let data = new FormData();
    data.append("items", purchaseJSON);
    await fetch("/fridge", { method: "POST", body: data });
    this.props.reload();
  };

  render = () => {
    return (
      <button className="main-button" onClick={this.buyItems}>
        Add all list items to fridge
      </button>
    );
  };
}

class DeleteButton extends Component {
  clickHandler = async () => {
    let data = new FormData();
    data.append("item", this.props.item);
    data.append("cont", this.props.container);
    await fetch("/delete", { method: "POST", body: data });
    this.props.reload();
  };

  render = () => {
    return (
      <button onClick={this.clickHandler} className="button-delete">
        X
      </button>
    );
  };
}

export { MenuButton, PurchaseButton, DeleteButton };
