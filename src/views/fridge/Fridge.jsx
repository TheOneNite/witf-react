import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FridgeItem from "./FridgeItem.jsx";
import FoodNav from "../../FoodNav.jsx";
import FridgeAction from "./FridgeAction.jsx";
import { loadFridge } from "../../scripts/networkActions.js";

class UnconnectedFridge extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  drawItem = itemData => {
    return <FridgeItem data={itemData} />;
  };

  loadFridge = async () => {
    const res = await fetch("/fetch-fridge", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "openFridge", fridge: bod.data });
      return;
    }
    alert("Error loading Fridge Contents");
  };

  render = () => {
    if (this.props.contents === undefined) {
      this.loadFridge();
      return (
        <div>
          <FoodNav />
          <div>Error Loading Fridge</div>
          <FridgeAction />
        </div>
      );
    }
    if (this.props.contents.length < 1) {
      return (
        <div>
          <FoodNav />
          <div>The Fridge is Empty :(</div>
          <FridgeAction />
        </div>
      );
    }
    return (
      <div>
        <FoodNav />
        <FridgeAction />
        <div className="wrapper-horozontial">
          {this.props.contents.map(this.drawItem)}
        </div>
      </div>
    );
  };
}

const mapState = state => {
  return {
    contents: state.fridge
  };
};

const Fridge = connect(mapState)(UnconnectedFridge);
export default Fridge;
