import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UnconnectedFoodNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  openFridge = async event => {
    const res = await fetch("/fetch-fridge", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log(bod);
      this.props.dispatch({ type: "openFridge", fridge: bod.data });
      return;
    }
    alert("Error loading Fridge Contents");
  };
  openPantry = async event => {
    const res = await fetch("/fetch-pantry", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "openPantry", pantry: bod.data });
      return;
    }
    alert("Error loading Pantry Contents");
  };
  openList = async event => {
    const res = await fetch("/fetch-list", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log(bod);
      this.props.dispatch({ type: "openList", list: bod.data });
      return;
    }
    alert("Error loading Shopping List");
  };
  render = () => {
    return (
      <div className="wrapper-button-action">
        <Link to="/fridge" className="button-link">
          <button onClick={this.openFridge} className="food-button">
            Fridge
          </button>
        </Link>
        <Link to="/fridge" className="button-link">
          <button onClick={this.openPantry} className="food-button">
            Pantry
          </button>
        </Link>
        <Link to="/list" className="button-link">
          <button onClick={this.openList} className="food-button">
            Shopping List
          </button>
        </Link>
      </div>
    );
  };
}

const FoodNav = connect()(UnconnectedFoodNav);
export default FoodNav;
