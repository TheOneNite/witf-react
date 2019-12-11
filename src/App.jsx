import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
//import MainMenu from "./MainMenu.jsx";
//import ContentWrapper from "./Content.jsx";
import { MenuButton, PurchaseButton } from "./Buttons.jsx";
import ShoppingForm from "./ShoppingForm.jsx";

import Signup from "./views/Signup.jsx";
import Login from "./views/Login.jsx";
import Fridge from "./views/fridge/Fridge.jsx";
import NavBar from "./views/navbar/NavBar.jsx";
import List from "./views/list/List.jsx";
import Recipes from "./views/recipes/Recipes.jsx";
import Settings from "./views/Account/Settings.jsx";

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
        <div className="shop-form-style">
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
    return <div>{this.drawItems()}</div>;
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

  scanRecipt = async () => {
    await fetch("/ocr-scan");
  };

  OCRtest = async () => {
    await fetch("/ocr-test");
  };
  /*
<Route exact={true} path="/shop" component={Shop} />
          
*/

  render = () => {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <NavBar />
            <Route exact={true} path="/" component={Login} />
            <Route exact={true} path="/signup" component={Signup} />
            <Route exact={true} path="/login" component={Login} />
            <Route exact={true} path="/fridge" component={Fridge} />
            <Route exact={true} path="/list" component={List} />
            <Route exact={true} path="/recipes/" component={Recipes} />
            <Route exact={true} path="/recipes/:route" component={Recipes} />
            <Route exact={true} path="/settings" component={Settings} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  };
}

export default App;
