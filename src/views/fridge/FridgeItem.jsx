import React, { Component } from "react";
import { connect } from "react-redux";
import { loadFridge } from "../../scripts/networkActions.js";
import AddToListForm from "../list/AddToListForm.jsx";
import EatFoodForm from "./EatFoodForm.jsx";

class UnconnectedFridgeItem extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: false, eatForm: false, notify: false };
  }
  toggleSelect = () => {
    this.setState({ selected: !this.state.selected });
  };
  toggleDetails = event => {
    this.setState({ details: !this.state.details });
  };
  toggleBuy = event => {
    this.setState({ buyForm: !this.state.buyForm });
  };
  toggleEat = event => {
    this.setState({ eatForm: !this.state.eatForm });
  };
  removeOne = async () => {
    let data = new FormData();
    data.append("collection", "fridge");
    data.append("delete", JSON.stringify(this.props.data));
    const res = await fetch("/delete-food", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    console.log(bod);
    bod = JSON.parse(bod);
    if (bod.success) {
      let frgRes = await loadFridge();
      if (frgRes.success) {
        this.props.dispatch({ type: "openFridge", fridge: frgRes.data });
        return;
      }
    }
    console.log(bod.msg);
    alert("Error removing item from fridge");
  };
  consumeFood = () => {};
  getDate = addDate => {
    let currentDate = new Date().getTime();
    const msDay = 86400000;
    let msDelta = currentDate - this.props.data.addDate;
    let dayDelta = msDelta / msDay;
    return Math.floor(dayDelta);
  };
  checkExpiry = () => {
    let currentDate = new Date().getTime();
    const msDay = 86400000;
    let delta = currentDate - this.props.data.addDate;
    delta = delta / msDay;

    return (
      Math.floor(delta) > this.props.expireDays && this.props.data.perishable
    );
  };
  renderDetails = () => {
    console.log(this.props.data);
    return (
      <div className="wrapper-item-detail">
        <div>
          <div className="item-header">{this.props.data.name}</div>
          <div className="item-detail">
            Added: {this.getDate(this.props.data.addDate)} days ago
          </div>
          <div className="item-detail">
            Remaining: {this.props.data.qty}{" "}
            {this.props.data.unit && " " + this.props.data.unit}
          </div>
        </div>
        <div>
          <button
            onClick={this.toggleDetails}
            className="button-action button-detail"
          >
            Back
          </button>
          <div className="item-detail-action">
            <button className="button-action" onClick={this.removeOne}>
              Compost
            </button>
            <button className="button-action" onClick={this.toggleEat}>
              Eat
            </button>
            <button className="button-action">Buy</button>
          </div>
        </div>
      </div>
    );
  };
  render = () => {
    if (this.state.eatForm) {
      return (
        <div
          onMouseEnter={this.toggleSelect}
          onMouseLeave={this.toggleSelect}
          className="item-wrapper"
        >
          <img src={this.props.data.imgPath} className="item-img" />
          <EatFoodForm
            data={this.props.data}
            collection="fridge"
            remove={this.removeOne}
            cancel={this.toggleEat}
          />
        </div>
      );
    }
    if (this.state.buyForm) {
      return (
        <AddToListForm
          name={this.props.data.name}
          qty={this.props.data.qty}
          unit={this.props.data.unit}
          fromFrg={this.toggleBuy}
        />
      );
    }
    if (this.state.details) {
      return (
        <div
          onMouseEnter={this.toggleSelect}
          onMouseLeave={this.toggleSelect}
          className="item-wrapper"
        >
          {this.renderDetails()}
          <img src={this.props.data.imgPath} className="item-img" />
        </div>
      );
    }
    if (this.state.selected) {
      return (
        <div
          onMouseEnter={this.toggleSelect}
          onMouseLeave={this.toggleSelect}
          className="item-wrapper"
        >
          <img src={this.props.data.imgPath} className="item-img" />
          <div className="wrapper-item-action">
            <button className="button-action" onClick={this.removeOne}>
              Compost
            </button>
            <button className="button-action" onClick={this.toggleEat}>
              Eat
            </button>
            <button className="button-action" onClick={this.toggleDetails}>
              Info
            </button>
            <button className="button-action" onClick={this.toggleBuy}>
              Buy
            </button>
          </div>
        </div>
      );
    }
    return (
      <div
        onMouseEnter={this.toggleSelect}
        onMouseLeave={this.toggleSelect}
        className="item-wrapper"
      >
        <img src={this.props.data.imgPath} className="item-img" />
        {this.checkExpiry() && <div className="overlay-expiry">!</div>}
      </div>
    );
  };
}

const mapState = state => {
  return { expireDays: state.expiry };
};

const FridgeItem = connect(mapState)(UnconnectedFridgeItem);
export default FridgeItem;
