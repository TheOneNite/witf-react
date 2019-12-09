import React, { Component } from "react";
import { connect } from "react-redux";
import RecipeIngredient from "./RecipeIngredient.jsx";

class UnconnectedRecipeView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  loadRec = async id => {
    const res = await fetch("/get-recipe?id=" + id, { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "loadRecipe", recData: bod.recData });
      return;
    }
    console.log(bod);
    alert(bod.msg);
  };
  renderIngredients = ingredientData => {
    return <RecipeIngredient ingData={ingredientData} />;
    return (
      <div>
        {ingredientData.name}: {ingredientData.qty + " " + ingredientData.unit}
      </div>
    );
  };
  render = () => {
    if (this.props.activeRec === undefined) {
      if (this.props.viewId === undefined) {
        return (
          <div className="wrapper-recipe-content item-subheader">
            No Recipe Selected
          </div>
        );
      }
      this.loadRec(this.props.viewId);
      return (
        <div className="wrapper-recipe-content item-subheader">Loading...</div>
      );
    }
    let recipe = this.props.activeRec;
    console.log(recipe);
    return (
      <div>
        <div className="item-header">{recipe.title}</div>
        <div className="wrapper-recipe-content">
          <div className="item-subheader">Ingredients</div>
          <div>{recipe.ingredients.map(this.renderIngredients)}</div>
          {recipe.method && (
            <>
              <div className="item-subheader">Method:</div>
              <p>{recipe.method}</p>
            </>
          )}
        </div>
      </div>
    );
  };
}

const mapState = state => {
  return { activeRec: state.displayRecipe };
};
const RecipeView = connect(mapState)(UnconnectedRecipeView);
export default RecipeView;
