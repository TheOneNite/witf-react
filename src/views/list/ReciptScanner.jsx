import React, { Component } from "react";
import { connect } from "react-redux";
import ScanItem from "./ScanItem.jsx";
import { Redirect } from "react-router-dom";
import { loadFridge } from "../../scripts/networkActions.js";

class UnconnectedReciptScanner extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "none" };
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
  renderItemList = () => {
    return (
      <div className="list-container">
        {this.state.parsedItems.map(itemData => {
          return (
            <ScanItem
              data={itemData}
              edit={this.editItem}
              delete={this.deleteItem}
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
  render = () => {
    if (this.state.status === "none") {
      return (
        <div>
          <form onSubmit={this.submitHandler} className="wrapper-img-upload">
            Upload image of recipt
            <input
              type="file"
              onChange={this.fileHandler}
              className="file-upload"
            />
            <button className="button-base">Parse Image</button>
          </form>
        </div>
      );
    }
    if (this.state.status === "uploading") {
      return <div>Loading...</div>;
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
