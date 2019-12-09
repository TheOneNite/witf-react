import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PantryItem from "./PantryItem.jsx";
import FoodNav from "../../FoodNav.jsx";
import PantryAction from "./PantryAction.jsx";
import { loadPantry } from "../../scripts/networkActions.js";

class UnconnectedPantry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  drawItem = itemData => {
    return <PantryItem data={itemData} />;
  };

  loadPantry = async () => {
    const res = await fetch("/fetch-pantry", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "openPantry", pantry: bod.data });
      return;
    }
    alert("Error loading Pantry Contents");
  };

  render = () => {
    console.log(this.props.contents);
    if (this.props.contents === undefined) {
      this.loadPantry();
      return (
        <div>
          <FoodNav />
          <div>Error Loading Pantry</div>
          <PantryAction />
        </div>
      );
    }
    if (this.props.contents.length < 1) {
      return (
        <div>
          <FoodNav />
          <div>The Pantry is Empty :(</div>
          <PantryAction />
        </div>
      );
    }
    return (
      <div>
        <FoodNav />
        <PantryAction />
        <div className="wrapper-horozontial">
          {this.props.contents.map(this.drawItem)}
        </div>
      </div>
    );
  };
}

const mapState = state => {
  return {
    contents: state.pantry
  };
};

const Pantry = connect(mapState)(UnconnectedPantry);
export default Pantry;
