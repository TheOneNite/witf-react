import React, { Component } from "react";
import { connect } from "react-redux";
import ScanItem from "./ScanItem.jsx";
import { Redirect } from "react-router-dom";
import { loadFridge } from "../../scripts/networkActions.js";
import Loader from "../../assets/loader.jsx";

class UnconnectedReciptScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "none",
      parsedItems: [
        {
          name: "VIURA AIREN VERDEJO ",
          qty: 750,
          unit: "ML",
          known: false,
          id: "lcwtrnoz"
        },
        {
          name: "TOMATE AXIANY ",
          qty: 255,
          unit: "GR",
          known: false,
          id: "vsioljfz"
        },
        { name: "BASILIC ", qty: 1, unit: "UN", known: false, id: "oymekxha" },
        {
          name: "* FILET DE MORUE FRAICHE ",
          qty: 1,
          unit: "KG",
          known: false,
          id: "qovuhvkr"
        },
        {
          name: "* FILET DE MORUE FRAICHE ",
          qty: 1,
          unit: "KG",
          known: false,
          id: "hlgrqvid"
        }
      ]
    };
  }
  submitHandler = async event => {
    console.log("recipt submitted");
    event.preventDefault();
    let data = new FormData();
    data.append("img", this.state.imgFile);
    this.setState({ status: "uploading" });
    const res = await fetch("/recipt-ocr", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    this.setState({ status: "returned", parsedItems: bod });
  };
  fileHandler = event => {
    console.log(event.target.files[0]);
    this.setState({ imgFile: event.target.files[0] });
  };
  addAll = async event => {
    this.setState({ status: "submitting" });
    let data = new FormData();
    let itemPak = JSON.stringify(this.state.parsedItems);
    data.append("items", itemPak);
    let res = await fetch("/fridge", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      //let frgRes = await loadFridge();
      //if (frgRes.success) {
      //this.props.dispatch({ type: "openFridge", fridge: frgRes.data });
      //}
      this.setState({ status: "complete" });
    }
    alert("Error adding recipt scan to fridge");
    this.setState({ status: "returned" });
  };
  idItem = (itemId, foodId) => {
    console.log("submitted id for " + itemId);
    let items = this.state.parsedItems;
    let newItems = undefined;
    for (let i = 0; i < items.length; i++) {
      console.log(items[i].id);
      if (items[i].id === itemId) {
        newItems = items.slice(0, i);
        let editItem = items[i];
        editItem.known = true;
        editItem.foodId = foodId;
        newItems.push(editItem);
        newItems = newItems.concat(items.slice(i + 1, items.length));
        break;
      }
    }
    this.setState({ parsedItems: newItems });
  };
  renderItemList = () => {
    return (
      <div className="list-container">
        {this.state.parsedItems.map(itemData => {
          return (
            <ScanItem
              data={itemData}
              edit={this.editItem}
              delete={this.deleteItem}
              itemId={this.idItem}
            />
          );
        })}
        <button onClick={this.addAll} className="button-base">
          Confirm
        </button>
      </div>
    );
  };
  editItem = itemData => {
    let newItem = itemData;
    let list = this.state.parsedItems.slice();
    console.log(list);
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === newItem.id) {
        list.splice(i, 1, newItem);
        break;
      }
    }
    this.setState({ parsedItems: list });
  };
  deleteItem = itemData => {
    let list = this.state.parsedItems;
    list = list.filter(item => {
      return item.id != itemData.id;
    });
    this.setState({ parsedItems: list });
  };
  cancelUpload = event => {
    console.log("cancel");
    this.props.dispatch({ type: "cancelImg" });
  };
  render = () => {
    if (this.state.status === "none") {
      return (
        <div className="wrapper-scan">
          <form onSubmit={this.submitHandler} className="wrapper-img-upload">
            Upload image of recipt
            <input
              type="file"
              onChange={this.fileHandler}
              className="file-upload"
            />
            <button className="button-base">Parse Image</button>
          </form>
          <button onClick={this.cancelUpload} className="button-base">
            Cancel
          </button>
        </div>
      );
    }
    if (this.state.status === "uploading") {
      return <Loader />;
    }
    if (
      this.state.status === "returned" ||
      this.state.status === "submitting"
    ) {
      return <div>{this.renderItemList()}</div>;
    }
    if (this.state.status === "complete") {
      return <Redirect to="/fridge" />;
    }
  };
}

const ReciptScanner = connect()(UnconnectedReciptScanner);
export default ReciptScanner;
