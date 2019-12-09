import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = { err: { exists: false } };
  }
  submitHandler = async event => {
    event.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    data.append("confirmpass", this.state.cpass);
    let res = await fetch("/signup", { method: "POST", body: data });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success === true) {
      this.props.dispatch({ type: "login" });
      return;
    }
    let newErr = { exists: true, msg: bod.msg };
    this.setState({ err: newErr });
  };
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  autologin = async () => {
    const res = await fetch("/autologin");
    let bod = await res.text();
    console.log(bod);
    bod = JSON.parse(bod);
    if (bod.success) {
      this.props.dispatch({ type: "login" });
      return;
    }
    if (bod.user) {
      return true;
    }
  };
  render = () => {
    if (this.props.loginStatus) {
      return <Redirect to="/fridge" />;
    }
    return (
      <div>
        Sign Up
        {this.state.err.exists && <div>{this.state.err.msg}</div>}
        <form onSubmit={this.submitHandler}>
          <div className="flex-vertical">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={this.inputHandler}
              value={this.state.username}
              className="text-box"
            />
            <input
              type="password"
              placeholder="password"
              name="password"
              onChange={this.inputHandler}
              value={this.state.password}
            />
            <input
              type="password"
              placeholder="confirm password"
              name="cpass"
              onChange={this.inputHandler}
              value={this.state.cpass}
            />
            <button className="button-style">Sign Up</button>
            <Link to="/login">login</Link>
          </div>
        </form>
      </div>
    );
  };
}

const mapState = state => {
  return { loginStatus: state.loggedIn };
};

const Signup = connect(mapState)(UnconnectedSignup);
export default Signup;
