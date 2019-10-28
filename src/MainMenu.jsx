import React, { Component } from "react";
import { MenuButton } from "./Buttons";

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.fridgeClick = {};
    this.shopClick = {};
  }

  render = () => {
    return (
      <>
        <MenuButton
          onClick={this.shopClick}
          displayText="View Shopping List"
          contentWrapperRef={this.props.contentWrapperRef}
        />
        <MenuButton
          onClick={this.fridgeClick}
          displayText="View Fridge Contents"
          contentWrapperRef={this.props.contentWrapperRef}
        />
      </>
    );
  };
}

export { MainMenu };
