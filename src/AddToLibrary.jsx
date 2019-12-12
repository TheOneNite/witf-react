import React, { Component } from "react";

class AddToLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  fileHandler = event => {
    console.log(event.target.files[0]);
    this.setState({ imgFile: event.target.files[0] });
  };
  submitHandler = async event => {
    event.preventDefault();
    let data = new FormData();
    data.append("img", this.state.imgFile);
    data.append("name", this.state.foodName);
    const res = await fetch("/library-add", { method: "POST", body: data });
  };
  render = () => {
    return (
      <div>
        <input
          type="text"
          onChange={this.handleInput}
          name="foodName"
          value={this.state.foodName}
          className="input-recipe-title"
          placeholder="Enter the singular name"
        />
        <div className="wrapper-scan">
          <form onSubmit={this.submitHandler} className="wrapper-img-upload">
            Upload an Image
            <input
              type="file"
              onChange={this.fileHandler}
              className="file-upload"
            />
            <button className="button-base">Submit</button>
          </form>
        </div>
      </div>
    );
  };
}

export default AddToLibrary;
