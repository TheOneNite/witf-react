import React, { Component } from "react";
import { connect } from "react-redux";
import RecipeIngredient from "./RecipeIngredient.jsx";
import { loadFridge } from "../../scripts/networkActions.js";
import Loader from "../../assets/loader.jsx";

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
  buyIngs = async event => {
    let ingList = this.props.activeRec.ingredients;
    let addAll = JSON.stringify(event.target.name);
    let data = new FormData();
    if (addAll) {
      data.append("neededOnly", true);
    }
    data.append("items", JSON.stringify(ingList));
    const res = await fetch("/list", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      alert("Ingredients successfully added to shopping list");
      return;
    }
    console.log(bod);
    alert("Error adding ingredients to list");
  };
  renderIngredients = ingredientData => {
    return <RecipeIngredient ingData={ingredientData} />;
  };
  render = () => {
    if (
      this.props.activeRec === undefined ||
      this.props.viewId != this.props.activeRec.id
    ) {
      if (this.props.viewId === undefined) {
        return (
          <div className="wrapper-recipe-content item-subheader">
            No Recipe Selected
          </div>
        );
      }
      this.loadRec(this.props.viewId);
      return (
        <div className="wrapper-recipe-content item-subheader">
          <Loader />
        </div>
      );
    }
    let recipe = this.props.activeRec;
    console.log(recipe);
    return (
      <div>
        <div className="item-header">{recipe.title}</div>
        <div className="wrapper-recipe-content">
          <div className="wrapper-recipe-contentheader">
            <div className="item-subheader">Ingredients</div>
            <button
              className="button-recipe-add"
              onClick={this.buyIngs}
              name="false"
            >
              Add All to List
            </button>
            <button
              className="button-recipe-add"
              onClick={this.buyIngs}
              name="true"
            >
              Add Missing to List
            </button>
            <button className="button-recipe-add">Cook</button>
            <div>{recipe.ingredients.map(this.renderIngredients)}</div>
          </div>
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
  return { activeRec: state.displayRecipe, fridge: state.fridge };
};
const RecipeView = connect(mapState)(UnconnectedRecipeView);
export default RecipeView;
