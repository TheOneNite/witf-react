import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UnconnectedRecipeList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  loadRec = event => {
    let recId = event.target.name;
    let rec = undefined;
    let recResult = this.props.recipes.filter(rec => {
      return rec.id === recId;
    });
    if (recResult.length === 1) {
      rec = recResult[0];
    }
    this.props.dispatch({ type: "loadRecipe", recData: rec });
  };
  loadLibrary = async () => {
    const res = await fetch("/rec-library", { credentials: "include" });
    let bod = await res.text();
    bod = JSON.parse(bod);
    console.log(bod);
    if (bod.success) {
      this.props.dispatch({ type: "loadRecLibrary", library: bod.recLib });
      return;
    }
    console.log(bod);
    alert(bod.msg);
  };
  dropdownHandler = event => {
    if (event.target.value === "None") {
      this.setState({ mealFilter: undefined });
      return;
    }
    this.setState({ mealFilter: event.target.value });
  };
  searchHandler = event => {
    this.setState({ searchQ: event.target.value });
  };
  filterCategories = () => {
    if (this.state.mealFilter === undefined) {
      return (
        <div className="wrapper-recipe-list">
          {this.props.categories.map(this.renderCategory)}
        </div>
      );
    }
    let cat = this.props.categories.filter(catName => {
      return catName === this.state.mealFilter;
    });

    return (
      <div className="wrapper-recipe-list">{cat.map(this.renderCategory)}</div>
    );
  };
  renderDropdown = () => {
    return (
      <select
        onChange={this.dropdownHandler}
        value={this.state.mealFilter}
        className="dropdown-base"
      >
        <option>None</option>
        {this.props.categories.map(catName => {
          return <option>{catName}</option>;
        })}
      </select>
    );
  };
  renderRecipe = recData => {
    return (
      <Link to={"/recipes/" + recData.id} className="recipe-list-link">
        <button name={recData.id} className="recipe-list-item">
          {recData.title}
        </button>
      </Link>
    );
  };
  renderCategory = categoryName => {
    let mealRecs = this.props.recipes.filter(recipeData => {
      return recipeData.cat === categoryName;
    });
    if (this.state.searchQ) {
      mealRecs = mealRecs.filter(recData => {
        return recData.title.includes(this.state.searchQ);
      });
    }
    return (
      <div>
        <div className="recipe-list-header">{categoryName}</div>
        <div className="wrapper-recipe-category">
          {mealRecs.map(this.renderRecipe)}
        </div>
      </div>
    );
  };
  render = () => {
    if (this.props.recipes === undefined) {
      this.loadLibrary();
      return (
        <div className="wrapper-recipe-picker">
          <div className="wrapper-recipe-search">
            <div>Loading...</div>
          </div>
        </div>
      );
    }
    return (
      <div className="wrapper-recipe-picker">
        <div className="wrapper-recipe-search">
          <div>
            <input
              type="text"
              onChange={this.searchHandler}
              value={this.state.searchQ}
              placeholder="Search"
              className="input-recipe"
            />
          </div>
          <div>
            <div className="recipe-search-header">Filter by category:</div>
            <div>{this.renderDropdown()}</div>
          </div>
        </div>
        <div>{this.filterCategories()}</div>
      </div>
    );
  };
}

const mapState = state => {
  return {
    recipes: state.recLib,
    categories: state.recCats
  };
};

const RecipeList = connect(mapState)(UnconnectedRecipeList);

export default RecipeList;
