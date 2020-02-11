import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class UnconnectedLanding extends Component {
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
    this.autologin();
    if (this.props.login) {
      return <Redirect to="/fridge" />;
    }
    /*
    <div className="wrapper-video-land">
    <video className="video-land" controls muted>
    <source src="/landingVid.mp4"></source>
    </video>
    <Link to="/signup" className="link-landing">
    Get Started
    </Link>
    </div>
    */
    window.location.reload();
    return <Redirect to="/login" />;
  };
}
const mapState = state => {
  return { login: state.loggedIn };
};

const Landing = connect(mapState)(UnconnectedLanding);

export default Landing;
