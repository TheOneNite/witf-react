import React, { Component } from "react";

class Loader extends Component {
  render = () => {
    let weight = this.props.weight;
    let size = this.props.size;
    if (this.props.size === undefined) {
      size = 32;
    }
    if (this.props.weight === undefined) {
      weight = 8;
    }
    return (
      <div className="wrapper-loading">
        <svg className="wrapper-loading">
          <circle
            cx="50"
            cy="50"
            r={size}
            stroke-width={weight}
            stroke="#7ec484"
            stroke-dasharray="50.26548245743669 50.26548245743669"
            fill="none"
            stroke-linecap="round"
            transform="rotate(24.5718 50 50)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="0 50 50;360 50 50"
            ></animateTransform>
          </circle>
        </svg>
      </div>
    );
  };
}

export default Loader;
