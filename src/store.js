import { createStore } from "redux";
import reducer from "./reducer.js";

const store = createStore(
  reducer,
  {
    loggedIn: false,
    fridge: undefined,
    pantry: undefined,
    list: undefined
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
