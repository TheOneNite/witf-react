import React, { Component } from "react";

class MenuButton extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <button className="main-button" onClick={this.props.onClick}>
        {this.props.displayText}
      </button>
    );
  };
}

export default MenuButton;
