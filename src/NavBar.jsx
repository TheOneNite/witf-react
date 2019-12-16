import React, { Component } from "react";
import { Link } from "react-router-dom";
import connect from "react-redux";

class UnconnectedNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    console.log(this.props.loginStatus);
    if (this.props.loginStatus) {
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
    }
    return <></>;
  };
}

const mapState = state => {
  return { loginStatus: state.loggedIn };
};

const NavBar = connect(mapState)(UnconnectedNavBar);

export default NavBar;
