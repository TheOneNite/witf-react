import React, { Component } from "react";
import { connect } from "react-redux";
import RecipeNav from "./RecipeNav.jsx";
import RecLibrary from "./RecLibrary.jsx";
import AddRecipeForm from "./AddRecipeForm.jsx";

class UnconnectedRecipes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    if (this.props.match.params.route === "add") {
      return (
        <div className="wrapper-view">
          <RecipeNav />
          <AddRecipeForm />
        </div>
      );
    }
    return (
      <div className="wrapper-view">
        <RecipeNav />
        <RecLibrary viewId={this.props.match.params.route} />
      </div>
    );
  };
}

const Recipes = connect()(UnconnectedRecipes);
export default Recipes;
