import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import Signup from "./views/Signup.jsx";
import Login from "./views/Login.jsx";
import Fridge from "./views/fridge/Fridge.jsx";
import NavBar from "./views/navbar/NavBar.jsx";
import List from "./views/list/List.jsx";
import Recipes from "./views/recipes/Recipes.jsx";
import Settings from "./views/Account/Settings.jsx";
import AddToLibrary from "./AddToLibrary.jsx";
import Landing from "./Landing.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="wrapper-app">
            <Route exact={true} path="/" component={Landing} />
            <NavBar />
            <Route exact={true} path="/signup" component={Signup} />
            <Route exact={true} path="/login" component={Login} />
            <Route exact={true} path="/fridge" component={Fridge} />
            <Route exact={true} path="/list" component={List} />
            <Route exact={true} path="/recipes/" component={Recipes} />
            <Route exact={true} path="/recipes/:route" component={Recipes} />
            <Route exact={true} path="/settings" component={Settings} />
            <Route exact={true} path="/add" component={AddToLibrary} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  };
}

export default App;
