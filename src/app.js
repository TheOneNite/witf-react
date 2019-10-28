let root = document.getElementById("root");
let serverIP = "http://localhost:4000";
let shopping = {};

let drawItems = items => {
  let itemNames = Object.keys(items);
  let itemElem = itemNames.map(item => {
    return React.createElement("li", {}, item + ": " + items[item]);
  });
  return React.createElement("ul", { className: "contents-style" }, itemElem);
};

let drawFridgeItems = fridge => {
  return React.createElement("div", {}, drawItems(fridge), shopButton);
};

let buyItems = async () => {
  console.log("pushing shopping to fridge");
  let purchaseJSON = JSON.stringify(shopping);
  let data = new FormData();
  data.append("items", purchaseJSON);
  await fetch("/fridge", { method: "POST", body: data });
  loadFridge();
};

let submitItem = ev => {
  ev.preventDefault();
  console.log("adding item");
  console.log(inputBox);
  console.log(amountBox);
  let data = new FormData();
  data.append("item", inputBox.value);
  data.append("amount", amountBox.value);
  fetch("/shop", { method: "POST", body: data });
  inputBox.value = "item";
  amountBox.value = "qty";
  loadShop();
};

let drawShopForm = () => {
  return React.createElement(
    "form",
    { className: "new-item-style" },
    inputBox,
    amountBox,
    submit
  );
};

let drawShoppingList = list => {
  return React.createElement(
    "div",
    {},
    drawItems(list),
    drawShopForm(),
    purchaseButton,
    fridgeButton
  );
};

let loadFridge = async () => {
  let fridgeRes = await fetch(serverIP + "/fridge");
  let fridgeJSON = await fridgeRes.text();
  let fridge = JSON.parse(fridgeJSON);
  ReactDOM.render(drawFridgeItems(fridge), root);
};

let loadShop = async () => {
  let shopRes = await fetch(serverIP + "/shop");
  let shopJSON = await shopRes.text();
  let shop = JSON.parse(shopJSON);
  shopping = shop;
  ReactDOM.render(drawShoppingList(shopping), root);
};

let inputBox = React.createElement("input", {
  type: "text",
  placeholder: "item",
  name: "item"
});

let amountBox = React.createElement("input", {
  type: "text",
  placeholder: "amount",
  name: "amount"
});

let submit = React.createElement(
  "button",
  { className: "button-submit", onClick: submitItem },
  "Add Item"
);

let fridgeButton = React.createElement(
  "button",
  { onClick: loadFridge, className: "main-button" },
  "View Fridge Contents"
);
let shopButton = React.createElement(
  "button",
  { onClick: loadShop, className: "main-button" },
  "View shopping List"
);
let purchaseButton = React.createElement(
  "button",
  { onClick: buyItems, className: "main-button" },
  "add all items on list to fridge"
);

let mainUI = React.createElement(
  "div",
  { className: "menu-main" },
  React.createElement("div", {}, fridgeButton),
  React.createElement("div", {}, shopButton)
);
