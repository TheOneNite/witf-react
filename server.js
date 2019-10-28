let express = require("express");
let app = express();
let multer = require("multer");
let upload = multer();
let cookieParser = require("cookie-parser");
let reloadMagic = require("./reload-magic.js");

app.use(cookieParser());

reloadMagic(app);

//global data and stuff

let fridge = {
  milk: "1/2 carton",
  greenBeans: "500g",
  coconutYoghurt: "1/2 container"
};
let shoppingList = { food: "lots", dessert: "the most" };

//asset managment

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// Your endpoints go after this line
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/shop", (req, res) => {
  console.log("shopping list retreived");
  let shopStr = JSON.stringify(shoppingList);
  res.send(shopStr);
});

app.post("/shop", upload.none(), (req, res) => {
  console.log("item added to shop");
  let item = req.body.item;
  if (item.split(" ").length > 0) {
    let words = item.split(" ");
    words = words.map(str => {
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    });
    item = words.join("");
  }
  let qty = req.body.qty;
  shoppingList[item] = qty;
  res.send(JSON.stringify({ success: true }));
});

app.get("/fridge", (req, res) => {
  console.log("fridge contents retreived");
  let fridgeStr = JSON.stringify(fridge);
  res.send(fridgeStr);
});

app.post("/fridge", upload.none(), (req, res) => {
  console.log("pushing purchases to fridge");
  let purchases = JSON.parse(req.body.items);
  let boughtItems = Object.keys(purchases);
  boughtItems.forEach(item => {
    fridge[item] = purchases[item];
    shoppingList[item] = undefined;
  });
  res.send(JSON.stringify({ success: true }));
});

app.post("/delete", upload.none(), (req, res) => {
  let target = req.body.cont;
  let item = req.body.item;
  console.log("removing" + item + "from " + target);
  if (target === "fridge") {
    fridge[item] = undefined;
  }
  if (target === "shop") {
    shoppingList[item] = undefined;
  }
  res.send(JSON.stringify({ success: true }));
});
// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
