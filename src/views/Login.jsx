import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  submitHandler = async event => {
    event.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let res = await fetch("/login", { method: "POST", body: data });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success === true) {
      this.props.dispatch({ type: "login" });
      return;
    }
    this.setState({ message: bod.msg });
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
      console.log("autolog success");
      this.props.dispatch({ type: "login" });
      return;
    }
    if (bod.user) {
      return false;
    }

    return false;
  };
  render = () => {
    if (this.props.loggedin) {
      console.log("redir");
      return <Redirect to="/fridge" />;
    }
    this.autologin();
    return (
      <div className="wrapper-auth">
        Login
        {this.state.message && <div>{this.state.message}</div>}
        <form onSubmit={this.submitHandler}>
          <div className="flex-vertical">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={this.inputHandler}
              value={this.state.username}
              className="input-auth"
            />
            <input
              type="password"
              placeholder="password"
              name="password"
              className="input-auth"
              onChange={this.inputHandler}
              value={this.state.password}
            />
            <button className="button-auth">Log In</button>
          </div>
        </form>
        <Link to="/signup">Create an Account</Link>
      </div>
    );
  };
}

const mapState = state => {
  return { loggedin: state.loggedIn };
};

const Login = connect(mapState)(UnconnectedLogin);

export default Login;
