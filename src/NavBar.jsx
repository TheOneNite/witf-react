import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    return (
      <div className="main-menu">
        <Link to="/fridge" className="nav-link">
          Food
        </Link>

        <Link to="/recipes" className="nav-link">
          Recipes
        </Link>

        <Link to="/settings" className="nav-link">
          Settings
        </Link>

        <Link to="/logout" className="nav-link">
          Logout
        </Link>
      </div>
    );
  };
}

export default NavBar;
