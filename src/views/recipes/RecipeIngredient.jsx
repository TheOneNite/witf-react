import React, { Component } from "react";

class RecipeIngredient extends Component {
  render = () => {
    return (
      <div className="recipe-ingredient">
        {this.props.ingData.qty}
        {this.props.ingData.unit && " " + this.props.ingData.unit + " "}
        {this.props.ingData.name}
      </div>
    );
  };
}
export default RecipeIngredient;
