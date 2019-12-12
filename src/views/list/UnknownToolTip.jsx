import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../assets/loader.jsx";

class UnconnectedUnknownToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: true
    };
  }
  sendSearch = async () => {
    if (new Date().getTime() >= this.state.timeOut) {
      console.log("SEARCHTIME");
      const res = await fetch("/search-lib?searchQ=" + this.state.searchQ);
      let bod = await res.text();
      bod = JSON.parse(bod);
      if (bod) {
        console.log(bod);
        this.setState({ searchRes: [bod], searchStatus: "returned" });
        return;
      }
      this.setState({
        searchRes: [{ foodId: "notfound" }],
        searchStatus: "returned"
      });
    }
  };
  confirmItem = async () => {
    let data = new FormData();
    data.append("newName", this.props.baseName);
    data.append("foodId", this.state.searchRes[0].foodId);
    fetch("/library-choice", { method: "POST", body: data });
    this.props.setId(this.state.searchRes[0].foodId);
  };
  searchHandler = event => {
    let timeOut = new Date().getTime() + 1500;
    this.setState({
      searchQ: event.target.value,
      searchStatus: "loading",
      timeOut
    });
    setTimeout(this.sendSearch, 1500);
  };
  toggleView = event => {
    this.setState({ view: !this.state.view });
  };
  renderResults = () => {
    if (this.state.searchStatus === "loading") {
      return <Loader />;
    }
    if (this.state.searchStatus === "returned") {
      return this.state.searchRes.map(libData => {
        if (libData.foodId === "notfound") {
          return <div>No item matched search</div>;
        }
        return (
          <button onClick={this.confirmItem} className="button-id-food">
            <img src={"/foodAssets/" + libData.imgPath} className="img-icon" />
            <div>{libData.names[0]}</div>
          </button>
        );
      });
    }
  };
  renderDetails = () => {
    return (
      <div className="wrapper-tooltip-warn">
        We didn't recognize this item
        <div>
          <input
            type="text"
            onChange={this.searchHandler}
            value={this.state.searchQ}
            placeholder="search"
            className="input-search-warn"
          />
          <Link className="link-warning" to="/add" target="_blank">
            Tell us about it
          </Link>
        </div>
        {this.state.searchStatus && this.renderResults()}
      </div>
    );
  };
  render = () => {
    return (
      <button className="button-warn" onClick={this.toggleWarn}>
        {this.state.view ? this.renderDetails() : "!"}
      </button>
    );
  };
}

const UnknownToolTip = connect()(UnconnectedUnknownToolTip);
export default UnknownToolTip;
