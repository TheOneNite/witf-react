const MongoClient = require("mongodb").MongoClient;
const dbLogin = require("../../backend/utilites/databaseURL.js");
const mongoConnect = () => {
  let mongoDb = new Promise((resolve, reject) => {
    MongoClient.connect(dbLogin, (err, dbRef) => {
      if (err) {
        console.log(err);
        reject("db connection failed");
      }
      console.log("DB module connected");
      resolve(dbRef.db("witf"));
    });
  });
  return mongoDb;
};

module.exports = mongoConnect;
