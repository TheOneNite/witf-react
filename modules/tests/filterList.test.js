let mongoDb = undefined;
const MongoClient = require("mongodb").MongoClient;
const dbLogin = require("../../backend/utilites/databaseURL.js");

const checkFridge = (list, fridge) => {
  const convert = require("../../backend/utilites/unitConverter.js");
  const itemLookup = item => {
    let buy = true;
    for (let i = 0; i < fridge.length; i++) {
      let fItem = fridge[i];
      if (item.name === fItem.name) {
        //name match
        if (fItem.unit === item.unit) {
          //ez lyfe
          buy = item.qty >= fItem.qty;
          break;
        } else {
          //convert list item to have same units as fridge item
          let cItem = convert.units(item.qty, item.unit, fItem.unit);
          console.log("converted:");
          if (isNaN(cItem)) {
            break;
          }
          buy = cItem.qty >= fItem.qty;
        }
      }
    }
    return buy;
  };
  list = list.filter(itemLookup);
  //console.log("filtered list");
  //console.log(list);
  return list;
};

let fridge = [{ name: "pecans", unit: "g", qty: 100 }];
let testList = [
  { qty: "5", unit: "tbsp", name: "apricot jam" },
  {
    qty: "250",
    unit: "g",
    name: "glacé or dried fruits , whole or cut into large strips"
  },
  { qty: "50", unit: "g", name: "pecans" },
  { qty: "50", unit: "g", name: "walnuts" },
  { qty: "0.25", unit: "cup", name: "almonds" },
  { qty: "", name: "pine nuts" }
];

beforeAll(done => {
  MongoClient.connect(dbLogin, (err, dbRef) => {
    if (err) {
      console.log(err);
    }
    console.log("DB connected");
    mongoDb = dbRef.db("witf");
    done();
  });
});

it("should not add items from list with more in the fridge", () => {
  let filterd = checkFridge(testList, fridge);
  expect(filterd).toEqual([
    { qty: "5", unit: "tbsp", name: "apricot jam" },
    {
      qty: "250",
      unit: "g",
      name: "glacé or dried fruits , whole or cut into large strips"
    },
    { qty: "50", unit: "g", name: "walnuts" },
    { qty: "0.25", unit: "cup", name: "almonds" },
    { qty: "", name: "pine nuts" }
  ]);
});
it("should add items to list if they're present in insufficient qty", () => {
  fridge.push({ qty: 25, name: "walnuts", unit: "g" });
  let filtered = checkFridge(testList, fridge);
  expect(filtered).toEqual([
    { qty: "5", unit: "tbsp", name: "apricot jam" },
    {
      qty: "250",
      unit: "g",
      name: "glacé or dried fruits , whole or cut into large strips"
    },
    { qty: "50", unit: "g", name: "walnuts" },
    { qty: "0.25", unit: "cup", name: "almonds" },
    { qty: "", name: "pine nuts" }
  ]);
});
it("should be able to handle converting same-realm  units", () => {
  fridge.push({ name: "apricot jam", qty: 1, unit: "cup" });
  let filtered = checkFridge(testList, fridge);
  expect(filtered).toEqual([
    {
      qty: "250",
      unit: "g",
      name: "glacé or dried fruits , whole or cut into large strips"
    },
    { qty: "50", unit: "g", name: "walnuts" },
    { qty: "0.25", unit: "cup", name: "almonds" },
    { qty: "", name: "pine nuts" }
  ]);
});
it("should add to list when unable to convert units", () => {
  fridge.push({ name: "almonds", qty: 500, unit: "g" });
  let filtereds = checkFridge(testList, fridge);
  expect(filtereds).toEqual([
    {
      qty: "250",
      unit: "g",
      name: "glacé or dried fruits , whole or cut into large strips"
    },
    { qty: "50", unit: "g", name: "walnuts" },
    { qty: "0.25", unit: "cup", name: "almonds" },
    { qty: "", name: "pine nuts" }
  ]);
});
