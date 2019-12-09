const reducer = (state, action) => {
  if (action.type === "throwErr") {
    return { ...state, err: action.msg };
  }
  if (action.type === "login") {
    return { ...state, loggedIn: true };
  }
  if (action.type === "openFridge") {
    return { ...state, fridge: action.fridge };
  }
  if (action.type === "openList") {
    return { ...state, list: action.list };
  }
  if (action.type == "addImg") {
    return { ...state, listUpload: true };
  }
  if (action.type === "loadRecipe") {
    return { ...state, displayRecipe: action.recData };
  }
  if (action.type === "loadRecLibrary") {
    return { ...state, recLib: action.library };
  }
  return state;
};

export default reducer;
