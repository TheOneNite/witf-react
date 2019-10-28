import React, { Component } from "react";
import { DeleteButton } from "./Buttons.jsx";

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: false };
  }

  setFocus = event => {
    //console.log("clicked on" + this.props.item);
    //event.preventDefault();
    this.setState({ selected: !this.state.selected });
  };

  render = () => {
    if (this.state.selected) {
      return (
        <div className="item-style" onMouseLeave={this.setFocus}>
          {this.props.item} : {this.props.qty}
          <DeleteButton
            item={this.props.item}
            container={this.props.container}
            reload={this.props.reload}
          />
        </div>
      );
    }
    return (
      <div className="item-style" onMouseEnter={this.setFocus}>
        {this.props.item} : {this.props.qty}
      </div>
    );
  };
}

export default ListItem;
