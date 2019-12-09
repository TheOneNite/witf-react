import React, { Component } from "react";
import RecipeList from "./RecipeList.jsx";
import RecipeView from "./RecipeView.jsx";

class RecLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    return (
      <div className="wrapper-recipe-form">
        <RecipeList />
        <RecipeView viewId={this.props.viewId} />
      </div>
    );
  };
}

export default RecLibrary;
