import React, { Component } from "react";
import CategoryButton from "./CategoryButton.jsx";
import { connect } from "react-redux";

class UnconnectedSettings extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: this.props.categories };
  }
  handleInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  loadCats = async () => {
    const res = await fetch("/rec-cats", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    console.log(bod);
    if (bod.success) {
      this.props.dispatch({ type: "loadRecCats", cats: bod.cats });
      return;
    }
    console.log(bod);
    alert(bod.msg);
  };
  loadExp = async () => {
    const res = await fetch("/user-data", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log(bod.data);
      this.setState({ expDays: bod.data.expTime });
      return;
    }
    console.log(bod);
    alert(bod.message);
  };
  submitExp = async event => {
    event.preventDefault();
    let data = new FormData();
    let edits = { expTime: this.state.expDays };
    data.append("edits", JSON.stringify(edits));
    const res = await fetch("/edit-user", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
    }
  };
  addCat = event => {
    let cats = this.props.categories.concat("new");
    this.props.dispatch({ type: "loadRecCats", cats: cats });
  };
  renderRecCats = () => {
    const drawCategory = catName => {
      return <CategoryButton catName={catName} />;
    };
    if (this.props.categories === undefined) {
      this.loadCats();
      return <div>Loading Recipe Categories...</div>;
    }
    return (
      <div>
        {this.props.categories.map(drawCategory)}
        <button onClick={this.addCat} className="button-base">
          Add
        </button>
      </div>
    );
  };
  render = () => {
    if (this.state.categories === undefined) {
      //this.loadCats();
    }
    if (this.state.expDays === undefined) {
      this.loadExp();
    }
    console.log(this.props.categories);
    console.log(this.state.categories);
    return (
      <div>
        <div className="list-wrapper">
          <form onSubmit={this.submitExp}>
            <div className="item-subheader">Default Food Perish time:</div>
            <input
              type="number"
              name="expDays"
              onChange={this.handleInput}
              value={this.state.expDays}
              className="input-unit"
            ></input>
            <div>Days</div>
          </form>
        </div>
        <div className="list-wrapper">
          <div className="item-subheader">Recipe Categories</div>
          <div>{this.renderRecCats()}</div>
        </div>
      </div>
    );
  };
}
const mapState = state => {
  console.log("mapState");
  return {
    categories: state.recCats
  };
};
const Settings = connect(mapState)(UnconnectedSettings);
export default Settings;
