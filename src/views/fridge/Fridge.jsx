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
  loadExp = async () => {
    const res = await fetch("/user-data", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      //console.log(bod.data);
      this.props.dispatch({ type: "setExpiry", expiry: bod.data.expTime });
      return;
    }
    console.log(bod);
    alert(bod.message);
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
  checkExpired = () => {
    const sendNote = () => {
      let notifyTime = new Date().getTime();
      let noteDelta = notifyTime - this.state.lastNote;
      if (noteDelta > this.props.noteTimeout || isNaN(noteDelta)) {
        //new Notification("Food in your fridge has gone bad");
        console.log("NOTIFY");
        this.setState({ lastNote: notifyTime });
      } else {
        console.log("notify timeout active");
      }
      //new Notification("Food in your fridge has gone bad");
    };
    const notifyExpiry = itemArr => {
      if (Notification.permission === "granted") {
        sendNote();
      } else {
        Notification.requestPermission().then(notifyPerms => {
          if (notifyPerms === "granted") {
            sendNote();
          }
        });
      }
    };
    const checkItem = itemData => {
      let currentDate = new Date().getTime();
      const msDay = 86400000;
      let delta = currentDate - itemData.addDate;
      delta = delta / msDay;
      //console.log("perishable" + itemData.perishable);
      //console.log("delta " + delta);
      return Math.floor(delta) > this.props.expiry && itemData.perishable;
    };
    let expiredItems = this.props.contents.filter(checkItem);
    if (expiredItems.length > 0) {
      notifyExpiry(expiredItems);
    }
  };
  renderItems = () => {
    let filteredItems = this.props.contents;
    if (this.props.searchQ) {
      filteredItems = this.props.contents.filter(item => {
        console.log(item);
        let name = item.name.toLowerCase();
        return name.includes(this.props.searchQ.toLowerCase());
      });
    }
    return filteredItems.map(this.drawItem);
  };
  render = () => {
    if (this.props.contents === undefined) {
      this.loadFridge();
      return (
        <div>
          <FoodNav />
          <div>Loading...</div>
          <FridgeAction />
        </div>
      );
    }
    if (this.props.expiry === undefined) {
      this.loadExp();
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
    this.checkExpired();

    return (
      <div>
        <FoodNav />
        <FridgeAction />
        <div className="wrapper-horozontial">{this.renderItems()}</div>
      </div>
    );
  };
}

const mapState = state => {
  return {
    contents: state.fridge,
    expiry: state.expiry,
    searchQ: state.query,
    noteTimeout: 72000000
  };
};

const Fridge = connect(mapState)(UnconnectedFridge);
export default Fridge;
