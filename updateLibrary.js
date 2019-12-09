const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const dbLogin = require("./backend/utilites/databaseURL.js");
const tools = require("./backend/utilites/tools.js");
let mongoDb = undefined;
MongoClient.connect(dbLogin, (err, dbRef) => {
  if (err) {
    console.log(err);
  }
  console.log("DB connected");
  mongoDb = dbRef.db("witf");
  updateLibrary();
});

const updateLibrary = () => {
  fs.readdir("./public/foodAssets", (err, files) => {
    if (err) {
      throw err;
    }
    console.log(files);
    const imgFiles = files;
    mongoDb
      .collection("lib")
      .find({})
      .toArray((err, libItems) => {
        if (err) {
          console.log(err);
          throw err;
        }
        let oldImgs = libItems.map(libItem => {
          return libItem.imgPath;
        });
        let newImgs = imgFiles.filter(filePath => {
          if (oldImgs.includes(filePath)) {
            return false;
          }
          return true;
        });
        newImgs.forEach(filePath => {
          let itemName = filePath.split(".").shift();
          mongoDb
            .collection("lib")
            .insertOne(
              {
                foodId: tools.generateId(10),
                imgPath: filePath,
                names: [itemName]
              },
              (err, result) => {
                if (err) {
                  throw err;
                }
                console.log(itemName + " successfully added to db");
              }
            );
        });
      });
  });
  //MongoClient.close();
};
