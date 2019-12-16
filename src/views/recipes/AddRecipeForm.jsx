import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import parseRec from "./parseRecipe.js";
import RecipeIngredient from "./RecipeIngredient.jsx";

class UnconnectedAddRecipeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ingredients: [], manualMode: false, cat: "dinner" };
  }
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleDropdown = event => {
    this.setState({ category: event.target.value });
  };
  loadCats = async () => {
    const res = await fetch("/rec-cats", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    console.log(bod);
    if (bod.success) {
      this.props.dispatch({ type: "loadRecCats", cats: bod.cats });
      return;
    }
    console.log(bod);
    alert(bod.msg);
  };
  submitRecipe = async event => {
    let data = new FormData();
    let newRec = {
      title: this.state.title,
      cat: this.state.category,
      ingredients: this.state.ingredients,
      method: this.state.method
    };
    newRec = JSON.stringify(newRec);
    data.append("recData", newRec);
    const res = await fetch("/recipe-add", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      this.setState({ redir: "/recipes/" + bod.recId });
      return;
    }
    console.log(bod);
    alert("Error submitting recipe");
  };
  manualIngredients = () => {
    return (
      <div className="wrapper-ingredient-form">
        <div className="wrapper-recipe-form">
          <input
            type="text"
            value={this.state.inputName}
            placeholder="Ingredient"
            onChange={this.inputHandler}
            name="inputName"
            className="input-recipe"
          />
        </div>
        <div className="wrapper-recipe-form">
          <input
            type="text"
            value={this.state.qty}
            placeholder="amount"
            onChange={this.inputHandler}
            name="inputQty"
            className="input-recipe"
          />
          <input
            type="text"
            value={this.state.unit}
            placeholder="unit"
            onChange={this.inputHandler}
            name="inputUnit"
            className="input-recipe"
          />
        </div>
        <button onClick={this.addIng} className="button-recipe-add">
          Add
        </button>
      </div>
    );
  };
  autoIngredients = () => {
    return (
      <div>
        <div>
          <div>
            <textarea
              onChange={this.importHandler}
              value={this.state.importIng}
              className="textblock-recipe"
              placeholder="Paste ingredient list here"
            />
          </div>
          <button
            onClick={this.parseIngredients}
            className="button-recipe-parse"
          >
            Parse
          </button>
        </div>
      </div>
    );
  };
  toggleMode = event => {
    this.setState({ manualMode: !this.state.manualMode });
  };
  importHandler = event => {
    this.setState({ importIng: event.target.value });
  };
  addIng = event => {
    let ing = {
      name: this.state.inputName,
      qty: this.state.inputQty,
      unit: this.state.inputUnit
    };
    console.log(ing);
    let newIng = this.state.ingredients.concat(ing);
    this.setState({
      ingredients: newIng,
      inputName: "",
      inputQty: "",
      inputUnit: ""
    });
  };
  parseIngredients = event => {
    let ingList = parseRec(this.state.importIng);
    this.setState({ ingredients: ingList });
  };
  renderIngredients = ingredientData => {
    return <RecipeIngredient ingData={ingredientData} />;
  };
  renderCatDropdown = catName => {
    return <option>{catName}</option>;
  };
  render = () => {
    if (this.state.redir) {
      return <Redirect to={this.state.redir} />;
    }
    if (this.props.categories === undefined) {
      this.loadCats();
      return <div>Loading...</div>;
    }
    return (
      <div className="container-recipe-form">
        <div className="wrapper-recipe-header">
          <input
            type="text"
            onChange={this.inputHandler}
            name="title"
            value={this.state.title}
            className="input-recipe-title"
            placeholder="Title"
          />
          <div>
            Category:{"  "}
            <select className="dropdown-base" onChange={this.handleDropdown}>
              {this.props.categories.map(this.renderCatDropdown)}
            </select>
          </div>
        </div>
        <div className="wrapper-recipe-form">
          <div className="wrapper-recipe-block">
            <div className="item-header">Ingredients:</div>
            {this.state.manualMode
              ? this.manualIngredients()
              : this.autoIngredients()}
            {this.state.ingredients.map(this.renderIngredients)}
            <button onClick={this.toggleMode} className="button-recipe-parse">
              {this.state.manualMode
                ? "Swap to Auto-detection"
                : "Swap to Manual Entry"}
            </button>
          </div>
          <div className="wrapper-recipe-block">
            <div className="item-header">Method:</div>
            <textarea
              name="method"
              onChange={this.inputHandler}
              value={this.state.method}
              className="textblock-recipe"
              placeholder="Paste recipe method here"
            />
          </div>
        </div>
        <button className="button-recipe-submit" onClick={this.submitRecipe}>
          Submit
        </button>
      </div>
    );
  };
}

const mapState = state => {
  return { categories: state.recCats };
};
const AddRecipeForm = connect(mapState)(UnconnectedAddRecipeForm);

export default AddRecipeForm;
