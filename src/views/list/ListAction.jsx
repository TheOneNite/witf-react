import React, { Component } from "react";
import { connect } from "react-redux";
import AddToListForm from "./AddToListForm.jsx";
import { loadList } from "../../scripts/networkActions.js";

class UnconnectedListAction extends Component {
  constructor(props) {
    super(props);
    this.state = { addItem: true };
  }
  toggleAdd = event => {
    this.setState({ addItem: !this.state.addItem });
  };
  addAll = async () => {
    let fullList = JSON.stringify(this.props.list);
    let data = new FormData();
    data.append("items", fullList);
    const res = await fetch("/fridge", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    console.log(bod);
    bod = JSON.parse(bod);
    if (bod.success) {
      fetch("/list-clear", { method: "POST", credentials: "include" });
      this.props.dispatch({ type: "openList", list: [] });
      return;
    }
    alert("Error pushing shopping to fridge");
  };
  addImg = () => {
    this.props.dispatch({ type: "addImg" });
  };
  render = () => {
    return (
      <div className="wrapper-list-action">
        {this.state.addItem && <AddToListForm />}
        <div className="wrapper-button-action">
          <button className="food-button" onClick={this.toggleAdd} id="add">
            +
          </button>
          <button className="food-button" onClick={this.addAll}>
            Push to Fridge
          </button>
          <button className="food-button" onClick={this.addImg}>
            Scan Recipt
          </button>
        </div>
      </div>
    );
  };
}

const mapState = state => {
  return { list: state.list };
};

const ListAction = connect(mapState)(UnconnectedListAction);
export default ListAction;
