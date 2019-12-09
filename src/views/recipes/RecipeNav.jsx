import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UnconnectedRecipeNav extends Component {
  render = () => {
    return (
      <div className="wrapper-button-action">
        <Link to="/recipes" className="button-link">
          <button onClick={this.openFridge} className="food-button">
            Library
          </button>
        </Link>
        <Link to="/recipes/add" className="button-link">
          <button className="food-button">Add</button>
        </Link>
      </div>
    );
  };
}

const RecipeNav = connect()(UnconnectedRecipeNav);
export default RecipeNav;
