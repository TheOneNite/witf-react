import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedPantryItem extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: false };
  }
  toggleSelect = () => {
    this.setState({ selected: !this.state.selected });
  };
  render = () => {
    if (this.state.selected) {
      return (
        <div
          onMouseEnter={this.toggleSelect}
          onMouseLeave={this.toggleSelect}
          className="item-wrapper"
        >
          <img src={this.props.data.imgPath} className="item-img" />
          <div className="wrapper-item-action">
            <button className="button-action">Trash</button>
            <button className="button-action">Eat</button>
            <button className="button-action">Info</button>
            <button className="button-action">Buy</button>
          </div>
        </div>
      );
    }
    return (
      <div
        onMouseEnter={this.toggleSelect}
        onMouseLeave={this.toggleSelect}
        className="item-wrapper"
      >
        <img src={this.props.data.imgPath} className="item-img" />
      </div>
    );
  };
}

const mapState = state => {
  return {};
};

const PantryItem = connect(mapState)(UnconnectedPantryItem);
export default PantryItem;
