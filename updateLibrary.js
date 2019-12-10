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
          let itemNames = [itemName];
          let multiword = [];
          let wordStart = 0;
          for (let i = 0; i < itemName.length; i++) {
            let char = itemName[i];
            if (char.toUpperCase() === char) {
              multiword.push(itemName.slice(wordStart, i));
              wordStart = i;
            }
          }
          if (multiword.length > 0) {
            itemNames.push(multiword.join(" "));
            let lastWord = multiword.pop();
            multiword.push(lastWord + "s");
            itemNames.push(multiword.join(" "));
          }
          itemNames.push(itemName + "s");
          mongoDb.collection("lib").insertOne(
            {
              foodId: tools.generateId(10),
              imgPath: filePath,
              names: itemNames
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
