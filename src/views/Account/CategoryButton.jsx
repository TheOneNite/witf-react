import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedCategoryButton extends Component {
  constructor(props) {
    super(props);
    this.state = { catName: this.props.catName };
  }
  selectOn = event => {
    this.setState({ selected: true });
  };
  selectOff = event => {
    this.setState({ selected: false });
  };
  toggleEdit = event => {
    this.setState({ editing: !this.state.editing });
  };
  handleInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  delete = async () => {
    let data = new FormData();
    data.append("action", "delete");
    data.append("editCat", this.props.catName);
    const res = await fetch("/edit-cats", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "loadRecCats", cats: bod.recCats });
      return;
    }
    console.log(bod);
    alert(bod.message);
  };
  submitEdit = async event => {
    let data = new FormData();
    if (this.state.adding) {
      data.append("action", "add");
      data.append("category", this.state.catName);
    } else {
      data.append("action", "edit");
      data.append("category", this.state.catName);
      data.append("editCat", this.props.catName);
    }
    const res = await fetch("/edit-cats", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "loadRecCats", cats: bod.recCats });
      this.setState({ editing: false, adding: false });
      return;
    }
    console.log(bod);
    alert(bod.message);
  };
  componentDidMount = () => {
    if (this.props.catName === "new") {
      this.setState({ editing: true, adding: true });
    }
  };
  render = () => {
    if (this.state.editing) {
      return (
        <div className="button-base">
          <input
            type="text"
            onChange={this.handleInput}
            name="catName"
            value={this.state.catName}
            placeholder="category name"
            className="input-unit"
          />
          <button className="button-list" onClick={this.submitEdit}>
            ✓
          </button>
        </div>
      );
    }
    return (
      <div
        onMouseEnter={this.selectOn}
        onMouseLeave={this.selectOff}
        className="list-style"
      >
        {this.state.catName}
        {this.state.selected && (
          <div>
            <button onClick={this.toggleEdit} className="button-edit">
              E
            </button>
            <button onClick={this.delete} className="button-delete">
              X
            </button>
          </div>
        )}
      </div>
    );
  };
}

const CategoryButton = connect()(UnconnectedCategoryButton);
export default CategoryButton;
