import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ListItem from "./ListItem.jsx";
import FoodNav from "../../FoodNav.jsx";
import ListAction from "./ListAction.jsx";
import { loadList } from "../../scripts/networkActions.js";
import ReciptScanner from "./ReciptScanner.jsx";

class UnconnectedFridge extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  drawItem = itemData => {
    return <ListItem data={itemData} />;
  };

  loadList = async () => {
    const res = await fetch("/fetch-list", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "openList", list: bod.data });
      return;
    }
    alert("Error loading shopping list");
  };

  render = () => {
    if (this.props.imgMode) {
      return (
        <div>
          <FoodNav />
          <ListAction />
          <ReciptScanner />
        </div>
      );
    }
    if (this.props.contents === undefined) {
      this.loadList();
      return (
        <div>
          <FoodNav />
          <ListAction />
          <div>Error loading shopping list</div>
        </div>
      );
    }
    if (this.props.contents.length < 1) {
      return (
        <div>
          <FoodNav />
          <ListAction />
          <div>No Items on shopping list</div>
        </div>
      );
    }
    return (
      <div className="wrapper-full-list">
        <FoodNav />
        <ListAction />
        <div className="list-container">
          {this.props.contents.map(this.drawItem)}
        </div>
      </div>
    );
  };
}

const mapState = state => {
  return {
    contents: state.list,
    //imgMode: true
    imgMode: state.listUpload
  };
};

const Fridge = connect(mapState)(UnconnectedFridge);
export default Fridge;
