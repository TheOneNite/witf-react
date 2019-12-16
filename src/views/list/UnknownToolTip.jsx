import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../assets/loader.jsx";
import { IncomingMessage } from "http";

class UnconnectedUnknownToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: false
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
        this.setState({ searchRes: bod, searchStatus: "returned" });
        return;
      }
      this.setState({
        searchRes: [{ foodId: "notfound" }],
        searchStatus: "returned"
      });
    }
  };
  confirmItem = async event => {
    let data = new FormData();
    data.append("newName", this.props.baseName);
    data.append("foodId", event.target.name);
    fetch("/library-choice", { method: "POST", body: data });
    this.props.setId(event.target.name);
  };
  searchHandler = event => {
    let timeOut = new Date().getTime() + 500;
    this.setState({
      searchQ: event.target.value,
      searchStatus: "loading",
      timeOut
    });
    setTimeout(this.sendSearch, 500);
  };
  toggleView = event => {
    this.setState({ view: !this.state.view });
  };
  renderResults = () => {
    const unpackName = name => {
      let wordStarts = [0];
      for (let i = 0; i < name.length; i++) {
        if (name[i] === name[i].toUpperCase()) {
          wordStarts.push(i);
        }
      }
      let words = [];
      if (wordStarts.length > 1) {
        for (let j = 0; j < wordStarts.length; j++) {
          let newWord = name.slice(wordStarts[j], wordStarts[j + 1]);
          if (newWord[0] != newWord[0].toUpperCase) {
            newWord =
              newWord[0].toUpperCase() + newWord.slice(1, newWord.length);
          }
          words.push(newWord);
        }
      } else {
        return name;
      }
      return words.join(" ");
    };
    if (this.state.searchStatus === "loading") {
      return <Loader />;
    }
    if (this.state.searchStatus === "returned") {
      return this.state.searchRes.map(libData => {
        console.log(libData);
        if (libData.foodId === "notfound") {
          return <div>No item matched search</div>;
        }
        return (
          <button
            onClick={this.confirmItem}
            className="button-id-food"
            name={libData.foodId}
          >
            <img src={"/foodAssets/" + libData.imgPath} className="img-icon" />
            <div>{unpackName(libData.names[0])}</div>
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
    if (this.state.view) {
      return <button className="button-warn">{this.renderDetails()}</button>;
    }
    return (
      <button className="button-warn" onClick={this.toggleView}>
        !
      </button>
    );
  };
}

const UnknownToolTip = connect()(UnconnectedUnknownToolTip);
export default UnknownToolTip;
