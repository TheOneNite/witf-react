import React, { Component } from "react";
//import MainMenu from "./MainMenu.jsx";
//import ContentWrapper from "./Content.jsx";
import { MenuButton, PurchaseButton } from "./Buttons.jsx";
import ShoppingForm from "./ShoppingForm.jsx";
import ListItem from "./ListItem.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawContent: this.drawError,
      content: this.loadError(),
      shopList: {}
    };
  }

  drawItems = () => {
    let itemNames = Object.keys(this.state.content);
    //console.log(itemNames);
    let getContainer = () => {
      if (this.state.content === this.state.shopList) {
        return "shop";
      }
      return "fridge";
    };
    let getReload = () => {
      if (this.state.content === this.state.shopList) {
        return this.loadShop;
      }
      return this.loadFridge;
    };
    return (
      <div className="list-style">
        {itemNames.map(item => {
          return (
            <ListItem
              item={item}
              qty={this.state.content[item]}
              container={getContainer()}
              reload={getReload()}
            />
          );
        })}
      </div>
    );
  };

  drawShop = () => {
    return (
      <div>
        {this.drawItems()}
        <div>
          <MenuButton
            onClick={this.loadFridge}
            displayText="View Fridge Contents"
          />
          <PurchaseButton list={this.state.shopList} reload={this.loadFridge} />
          <ShoppingForm reload={this.loadShop} />
        </div>
      </div>
    );
  };

  loadShop = async () => {
    let shopRes = await fetch("/shop");
    let shopJSON = await shopRes.text();
    let shop = JSON.parse(shopJSON);
    this.setState({
      drawContent: this.drawShop,
      content: shop,
      shopList: shop
    });
  };

  drawFridge = () => {
    return (
      <div>
        {this.drawItems()}
        <MenuButton onClick={this.loadShop} displayText="View Shopping List" />
      </div>
    );
  };

  loadFridge = async () => {
    let fridgeRes = await fetch("/fridge");
    let fridgeJSON = await fridgeRes.text();
    let fridge = JSON.parse(fridgeJSON);
    this.setState({ drawContent: this.drawFridge, content: fridge });
  };

  loadError = () => {
    return {};
  };

  drawError = () => {
    return <div>Error: page not found</div>;
  };

  render = () => {
    return (
      <div className="bg">
        <div>
          <MenuButton
            onClick={this.loadFridge}
            displayText="View Fridge Contents"
          />
          <MenuButton
            onClick={this.loadShop}
            displayText="View Shopping List"
          />
        </div>
        <div>{this.state.drawContent()}</div>
      </div>
    );
  };
}

export default App;
