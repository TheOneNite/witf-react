import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render = () => {
    return (
      <div className="wrapper-video-land">
        <video className="video-land" autoPlay muted controls loop>
          <source src="/landingVid.mp4"></source>
        </video>
        <Link to="/signup" className="link-landing">
          Get Started
        </Link>
      </div>
    );
  };
}

export default Landing;
