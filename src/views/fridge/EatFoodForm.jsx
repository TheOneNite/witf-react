import React, { Component } from "react";
import { connect } from "react-redux";
import units from "../../assets/units.js";
import AddToListForm from "../list/AddToListForm.jsx";

class UnconnectedEatFoodForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider: true,
      slideRatio: 0,
      eatUnit: "tsp",
      finished: true,
      buy: true
    };
  }
  toggleView = event => {
    this.setState({ slider: !this.state.slider });
  };
  toggleList = event => {
    this.setState({ buy: true });
  };
  toggleBuy = event => {
    this.setState({ buy: !this.state.buy });
  };
  submitHandler = async event => {
    event.preventDefault();
    let data = new FormData();
    data.append("item", JSON.stringify(this.props.data));
    data.append("slideMode", this.state.slider);
    data.append("foodCol", this.props.collection);
    if (this.state.slider) {
      data.append("slideValue", this.state.slideRatio);
    } else {
      data.append("eatQty", this.state.eatQty);
      data.append("eatUnit", this.state.eatUnit);
    }
    let res = await fetch("/eat", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    console.log(bod);
    if (bod.success) {
      if (bod.finished) {
        this.setState({ finished: true });
        return;
      }
      this.props.cancel();
      return;
    }
    alert("Error updating item");
  };
  sliderHandler = event => {
    this.setState({ slideRatio: event.target.value });
  };
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  dropdownHandler = event => {
    this.setState({ eatUnit: event.target.value });
  };
  addToList = () => {};
  drawDropdown = optionTxt => {
    return <option>{optionTxt}</option>;
  };
  render = () => {
    if (this.state.finished) {
      console.log("food item done");
      if (this.state.buy) {
        return (
          <div className="wrapper-food-empty">
            <AddToListForm
              name={this.props.data.name}
              qty={this.props.data.qty}
              unit={this.props.data.unit}
              fromFrg={this.props.remove}
            />
          </div>
        );
      }
      return (
        <div className="wrapper-food-empty">
          <div className="item-header">
            That was the last of your {this.props.data.name}
          </div>
          <div className="wrapper-empty-action">
            <button onClick={this.toggleBuy} className="button-action">
              Buy More
            </button>
            <button onClick={this.props.remove} className="button-action">
              Ok
            </button>
          </div>
        </div>
      );
    }
    if (this.state.slider) {
      return (
        <div className="wrapper-eat-form">
          <form onSubmit={this.submitHandler}>
            <button className="button-eat" onClick={this.toggleView}>
              Swap
            </button>
            <button className="button-eat" onClick={this.props.cancel}>
              Cancel
            </button>
            <div className="slider-wrapper">
              <input
                type="range"
                className="slider-base"
                onChange={this.sliderHandler}
                value={this.state.slideRatio}
              />
            </div>
            <div className="slider-display">
              {Math.floor(this.state.slideRatio)}%
            </div>
            <button className="button-eat">Eat</button>
          </form>
        </div>
      );
    }
    return (
      <div className="wrapper-eat-form">
        <div className="wrapper-eat-action">
          <button className="button-eat" onClick={this.toggleView}>
            Swap Mode
          </button>
          <button className="button-eat" onClick={this.props.cancel}>
            Cancel
          </button>
        </div>
        <form onSubmit={this.submitHandler}>
          <div className="form-eat">
            <input
              type="text"
              size="4"
              className="input-eat"
              name="eatQty"
              onChange={this.inputHandler}
            ></input>
            <select
              name="eatUnit"
              value={this.state.eatUnit}
              onChange={this.dropdownHandler}
              className="dropdown-eat"
            >
              {units.map(this.drawDropdown)}
            </select>
          </div>
          <button className="button-eat">Eat</button>
        </form>
      </div>
    );
  };
}

const EatFoodForm = connect()(UnconnectedEatFoodForm);
export default EatFoodForm;
