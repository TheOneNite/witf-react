// libraries setup
const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads" });
const tools = require("./backend/utilites/tools.js");

const auth = require("password-hash");
const cookieParser = require("cookie-parser");
const reloadMagic = require("./reload-magic.js");
const vision = require("@google-cloud/vision");
const projectID = "witf-257419";
//const keyPath = "__dirname + "\\cloudVision\\witf-52d1a1543c18.json";"
const cvAuthDir =
  "export GOOGLE_APPLICATION_CREDENTIALS='C:/Users/travi/decode/witf/react-app/cloudVision/witf-257419-340fa03fa322.json'";
console.log(keyPath);
const client = new vision.ImageAnnotatorClient();

const MongoClient = require("mongodb").MongoClient;
const dbLogin = require("./backend/utilites/databaseURL.js");
let mongoDb = undefined;
MongoClient.connect(dbLogin, (err, dbRef) => {
  if (err) {
    console.log(err);
  }
  console.log("DB connected");
  mongoDb = dbRef.db("witf");
});
const fs = require("fs");

app.use(cookieParser());

reloadMagic(app);

//custom modules setup
const ocr = require("./modules/recipt-ocr.js");
const libTools = require("./modules/libLookup.js");
const convert = require("./backend/utilites/unitConverter.js");

//functions

let ocrTest = async () => {};
//OCR processing-----------------------------------------------------------------------------------------------
const scanRecipt = async filePath => {
  console.log("sending user img");
  let sendTime = new Date().getTime();
  let scanResult = await client.textDetection(filePath);
  let resTime = new Date().getTime();
  console.log("OCR returned in " + resTime - sendTime + "ms");
  let detections = scanResult.map(result => {
    return result.fullTextAnnotation;
  });
  let lines = detections[0].text.split("\n");
  console.log(lines);
  return lines;
};
let processScan = reciptArr => {
  let startDelimiters = ["*-*", "Fac#"];
  let findStart = lines => {
    let start = 0;
    for (let j = 0; j < lines.length; j++) {
      let checkLine = line => {
        for (let i = 0; i < startDelimiters.length; i++) {
          if (line.includes(startDelimiters[i])) {
            return true;
          }
        }
      };
      let line = lines[j];
      if (checkLine(line)) {
        return j;
      }
    }
  };
  let findEnd = lines => {
    for (let i = 0; i < lines.length; i++) {
      line = lines[i].toUpperCase();
      if (line.includes("VENTE")) {
        return i;
      }
    }
  };
  let cleanup = recipt => {
    //removes various administrative items from list eg. prices, bottle deposit.
    //removeX fns should return a bool(false for undesired items), and the incoming recipt should be modified using recipt.filter(removeXfn)
    let removePrices = str => {
      if (str[0] === "$") {
        return false;
      }
      if (isNaN(parseInt(str[0]))) {
        return true;
      }
      return false;
    };
    let removeDeposit = item => {
      if (item.includes("Dépôt bouteille")) {
        return false;
      }
      return true;
    };
    recipt = recipt.filter(removePrices);
    recipt = recipt.filter(removeDeposit);
    return recipt;
  };
  let itemStart = findStart(reciptArr) + 1;
  //console.log("item list starts at line " + itemStart);
  let itemEnd = findEnd(reciptArr) - 1;
  reciptArr = reciptArr.slice(itemStart, itemEnd);
  reciptArr = cleanup(reciptArr);
  let newItems = reciptArr.map(ocr.itemParse);
  return newItems;
};
// units ----------------------------------------------------------------------------------------------------
//Food library lookups etc ----------------------------------------------------------------------------------
const checkFridge = (list, fridge) => {
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
const getFoodbyID = (id, searchArr) => {
  let result = searchArr.filter(searchArr => {
    return searchArr.id === id;
  });
  if (result.length > 0) {
    return result[0];
  }
  return [];
};
const getLibItem = async itemData => {
  const imgPrefix = "http://localhost:4000/foodAssets/";
  itemData.addDate = new Date().getTime();
  itemData.id = tools.generateId(8);
  const newData = new Promise((resolve, reject) => {
    if (itemData.foodId) {
      console.log("food ID found");
      mongoDb
        .collection("lib")
        .findOne({ foodId: itemData.foodId }, (err, result) => {
          if (err) {
            console.log(err);
            itemData.imgPath = imgPrefix + "noImg.png";
            resolve(itemData);
            return;
          }
          itemData.imgPath = imgPrefix + result.imgPath;
          resolve(itemData);
        });
      return;
    }
    mongoDb
      .collection("lib")
      .findOne({ names: itemData.name.toLowerCase() }, (err, result) => {
        if (err) {
          console.log(err);
          itemData.imgPath = imgPrefix + "noImg.png";
          resolve(itemData);
          return;
        }
        if (result === null) {
          console.log("no library item found for that food");
          itemData.imgPath = imgPrefix + "noImg.png";
          resolve(itemData);
          return;
        }
        itemData.imgPath = imgPrefix + result.imgPath;
        console.log("added image path: " + itemData.imgPath);
        resolve(itemData);
      });
  });
  return newData;
};

// user handling
initializeUser = uid => {
  mongoDb
    .collection("fridge")
    .insertOne({ uid: uid, data: [] }, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  mongoDb
    .collection("pantry")
    .insertOne({ uid: uid, data: [] }, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  mongoDb
    .collection("list")
    .insertOne({ uid: uid, data: [] }, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  mongoDb.collection("users").insertOne({
    uid: uid,
    recLibrary: [],
    recCats: ["lunch", "dinner", "breakfast", "dessert"],
    expTime: 3
  });
};

findUIDbySID = sid => {
  let uid = new Promise((resolve, reject) => {
    mongoDb.collection("sessions").findOne({ sid }, (err, result) => {
      if (err) {
        console.log(err);
        resolve({ success: false, msg: "session db read error" });
        return;
      }
      if (result === null) {
        console.log("null result");
        resolve({ success: false, msg: "no session found" });
        return;
      }
      resolve({ success: true, uid: result.uid });
    });
  });
  return uid;
};

//asset managment

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// Your endpoints go after this line
app.post("/login", upload.none(), (req, res) => {
  let usergiven = req.body.username;
  let passgiven = req.body.password;
  let authPass = undefined;
  mongoDb
    .collection("auth")
    .findOne({ username: usergiven }, (err, dbResult) => {
      if (err) {
        console.log(err);
      }
      if (dbResult === null) {
        console.log("no credentials found for username");
        res.send(
          JSON.stringify({
            success: false,
            msg: "Invalid Username or Password"
          })
        );
        return;
      }
      console.log("credentials retreived");
      console.log(dbResult);
      authPass = dbResult.password;
      if (auth.verify(passgiven, authPass)) {
        const sid = tools.generateId(5);
        const newSession = {
          sid: sid,
          uid: dbResult.uid
        };
        mongoDb.collection("sessions").insertOne(newSession, (err, result) => {
          if (err) {
            console.log(err);
            res.send(
              JSON.stringify({ success: false, msg: "failed to set cookie" })
            );
          }
          res.cookie("sid", sid);
          res.send(JSON.stringify({ success: true }));
        });
        return;
      }
    });
});

app.post("/signup", upload.none(), (req, res) => {
  console.log("POST: /signup");
  const usergiven = req.body.username;
  mongoDb
    .collection("auth")
    .findOne({ username: usergiven }, (err, dbResult) => {
      if (err) {
        console.log(err);
      }
      console.log("unique username check:");
      console.log(dbResult);
      if (dbResult) {
        console.log("user exists");
        res.send(
          JSON.stringify({ success: false, msg: "Username is already taken" })
        );
        return;
      }
      console.log("passed name uniqueness");
      if (req.body.password != req.body.confirmpass) {
        console.log("pass match error");
        res.send(
          JSON.stringify({
            success: false,
            msg: "the passwords you provided do not match"
          })
        );
        return;
      }
      let hpass = auth.generate(req.body.password);
      const uid = tools.generateId(10);
      let userAuth = { username: req.body.username, password: hpass, uid: uid };
      mongoDb.collection("auth").insertOne(userAuth, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("user auth data retreived");
      });
      let newUser;
      let sid = tools.generateId(5);
      initializeUser(uid);
      mongoDb
        .collection("sessions")
        .insertOne({ sid: sid, uid: uid }, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("session " + sid + " up");
          res.cookie("sid", sid);
          res.send(JSON.stringify({ success: true }));
        });
    });
});
app.get("/autologin", (req, res) => {
  if (req.cookies.uid === undefined) {
    console.log("first time visitor");
    res.cookie("uid", tools.generateId(10));
    res.send(JSON.stringify({ success: false }));
    return;
  }
  mongoDb
    .collection("sessions")
    .findOne({ sid: req.cookies.sid }, (err, dbResult) => {
      if (dbResult) {
        res.send(JSON.stringify({ success: true, user: true }));
        return;
      }
      res.send(JSON.stringify({ success: false, user: true }));
    });
});
app.get("/user-data", (req, res) => {
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      mongoDb.collection("users").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
          // send db read error
        }
        if (result === null) {
          // send no user error
        }
        res.send(JSON.stringify({ success: true, data: result }));
      });
      return;
    }
    res.send(
      JSON.stringify({ success: false, msg: "no active session found" })
    );
  });
});
app.post("/edit-user", upload.none(), (req, res) => {
  console.log("POST /edit-user");
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      let edits = JSON.parse(req.body.edits);
      let props = Object.keys(edits);
      props.forEach(editProp => {
        mongoDb
          .collection("users")
          .updateOne(
            { uid },
            { $set: { [editProp]: edits[editProp] } },
            (err, result) => {
              if (err) {
                console.log(err);
              }
            }
          );
      });
      res.send(JSON.stringify({ success: true }));
      return;
    }
    // send no session error
    res.send(JSON.stringify({ success: false }));
  });
});
// Shopping List Endpoints -----------------------------------------------------------------------------
app.get("/fetch-list", (req, res) => {
  console.log("GET: fetch-list");
  mongoDb
    .collection("sessions")
    .findOne({ sid: req.cookies.sid }, (err, session) => {
      if (err) {
        console.log(err);
        res.send(
          JSON.stringify({
            success: false,
            msg: "dbSession could not be found"
          })
        );
        return;
      }
      const uid = session.uid;
      mongoDb
        .collection("list")
        .find({ uid })
        .toArray((err, result) => {
          if (err) {
            console.log(err);
            res.send(
              JSON.stringify({
                success: false,
                msg: "error reading list from db"
              })
            );
            return;
          }
          let list = result[0].data;
          res.send(JSON.stringify({ success: true, data: list }));
        });
    });
});
app.post("/list", upload.none(), (req, res) => {
  console.log("POST /list");
  findUIDbySID(req.cookies.sid).then(session => {
    const uid = session.uid;
    let allItems = JSON.parse(req.body.items);
    let filter = JSON.parse(req.body.neededOnly);
    if (filter) {
      console.log("removing items already in fridge");
      mongoDb.collection("fridge").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
        }
        checkFridge(allItems, fridge);
        //allItems = checkFridge(allItems, fridge);
      });
    }
    allItems.forEach(item => {
      console.log("adding item" + item.name);
      item.id = tools.generateId(8);
    });
    mongoDb.collection("list").findOne({ uid }, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      if (result === null) {
        mongoDb
          .collection("list")
          .insertOne({ uid: uid, data: allItems }, (err, result) => {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log("list entry added for user " + uid);
          });
        res.send(JSON.stringify({ success: true }));
        return;
      }
      let newList = result.data;
      newList = newList.concat(allItems);
      mongoDb
        .collection("list")
        .updateOne({ uid }, { $set: { data: newList } }, (err, result) => {
          if (err) {
            console.log(err);
            res.send(JSON.stringify({ success: false, msg: "db write error" }));
            return;
          }
          allItems.forEach(item => {
            console.log("added " + item.name + " to shopping list");
          });
          res.send(JSON.stringify({ success: true }));
        });
    });
  });
});
app.post("/delete-list", upload.none(), (req, res) => {
  console.log("POST: delete-list");
  findUIDbySID(req.cookies.sid).then(session => {
    const uid = session.uid;
    const removeItem = JSON.parse(req.body.item);
    mongoDb.collection("list").findOne({ uid }, (err, result) => {
      if (err) {
        console.log(err);
        res.send(JSON.stringify({ success: false, msg: "db read error" }));
        throw err;
      }
      if (result === null) {
        console.log("result not found");
        res.send(
          JSON.stringify({ success: false, msg: "no list found for user" })
        );
        return;
      }
      let list = result.data;
      list = list.filter(item => {
        return item.id != removeItem.id;
      });
      mongoDb
        .collection("list")
        .updateOne({ uid: uid }, { $set: { data: list } }, (err, result) => {
          if (err) {
            console.log(err);
            res.send(JSON.stringify({ success: false, msg: "db read error" }));
            return;
          }
          console.log("shopping list updated for user" + uid);
          res.send(JSON.stringify({ success: true }));
        });
    });
  });
});
app.post("/update-list", upload.none(), (req, res) => {
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      let uid = session.uid;
      let newItem = JSON.parse(req.body.item);
      mongoDb.collection("list").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
        }
        let list = result.data;
        for (let i = 0; i < list.length; i++) {
          let listItem = list[i];
          if (listItem.id === newItem.id) {
            list.splice(i, 1, newItem);
            break;
          }
        }
        mongoDb
          .collection("list")
          .updateOne({ uid }, { $set: { data: list } }, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("updated shopping list");
          });
      });
      return;
    }
  });
});
app.post("/list-clear", upload.none(), (req, res) => {
  findUIDbySID(req.cookies.sid).then(session => {
    mongoDb
      .collection("list")
      .updateOne(
        { uid: session.uid },
        { $set: { data: [] } },
        (err, result) => {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log("cleared list for user " + session.uid);
        }
      );
  });
});
// Recipt OCR endpoints ------------------------------------------------------------------------
app.post("/recipt-ocr", upload.single("img"), (req, res) => {
  console.log("POST /recipt-ocr");
  findUIDbySID(req.cookies.sid).then(session => {
    let imgPath = req.file.path;
    scanRecipt(imgPath).then(scannedLines => {
      let items = processScan(scannedLines);
      Promise.all(
        items.map(async item => {
          let picture = await libTools.libLookup(item.name, mongoDb);
          if (picture) {
            item.known = true;
            item.foodId = picture.foodId;
          } else {
            item.known = false;
          }
          item.id = tools.generateId(8);
          return item;
        })
      ).then(items => {
        console.log(JSON.stringify(items));
        res.send(JSON.stringify(items));
      });
    });
  });
});
// Fridge content endpoints --------------------------------------------------------------------------
app.get("/fetch-fridge", (req, res) => {
  console.log("GET: fetch-fridge");
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      mongoDb
        .collection("fridge")
        .find({ uid })
        .toArray((err, result) => {
          if (err) {
            console.log(err);
            res.send(
              JSON.stringify({
                success: false,
                msg: "error reading fridge from db"
              })
            );
            return;
          }
          let fridge = result[0].data;
          res.send(JSON.stringify({ success: true, data: fridge }));
        });
      return;
    }
    res.send(JSON.stringify({ success: false, msg: "user not logged in" }));
  });
});
app.post("/fridge", upload.none(), (req, res) => {
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      console.log("session found");
      const uid = session.uid;
      mongoDb.collection("fridge").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
          res.send(
            JSON.stringify({
              success: false,
              msg: "error retreiving fridge from db"
            })
          );
          return;
        }
        if (result === null) {
          newItems = JSON.parse(req.body.items);
          Promise.all(newItems.map(getLibItem)).then(newItems => {
            mongoDb
              .collection("fridge")
              .insertOne(
                { uid: session.uid, data: [newItems] },
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  console.log("new fridge user added");
                  console.log("result");
                  res.send({ success: true });
                }
              );
          });
          return;
        } else {
          let fridge = result.data;
          console.log(req.body);
          let newItems = JSON.parse(req.body.items);
          Promise.all(newItems.map(getLibItem)).then(newItems => {
            console.log(newItems);
            fridge = fridge.concat(newItems);
            mongoDb
              .collection("fridge")
              .updateOne({ uid }, { $set: { data: fridge } }, (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log("item successfully added to fridge");
                res.send(JSON.stringify({ success: true }));
              });
          });
        }
      });
      return;
    }
    res.send(
      JSON.stringify({
        success: false,
        msg: "error retreiving fridge from db"
      })
    );
  });
});
app.post("/eat", upload.none(), (req, res) => {
  console.log("POST:/eat");
  findUIDbySID(req.cookies.sid).then(session => {
    const uid = session.uid;
    const reqItem = JSON.parse(req.body.item);
    const updateQty = (updateItem, upI, eatQty, food) => {
      console.log(updateItem);
      updateItem.qty = parseFloat(updateItem.qty);
      let uResult = new Promise((resolve, reject) => {
        console.log("removing " + eatQty + " from " + updateItem.qty);
        updateItem.qty = updateItem.qty - eatQty;
        console.log(updateItem);
        if (updateItem.qty <= 0) {
          resolve({
            success: true,
            finished: true,
            itemId: reqItem.id
          });
        }
        food.splice(upI, 1, updateItem);
        mongoDb
          .collection(req.body.foodCol)
          .updateOne({ uid }, { $set: { data: food } }, (err, result) => {
            if (err) {
              console.log(err);
              resolve({
                success: false,
                msg: "error writing updated fridge to db"
              });
            }
            console.log("fridge qty updated");
            resolve({ success: true });
          });
      });
      return uResult;
    };
    let mode = JSON.parse(req.body.slideMode);
    if (mode) {
      console.log("update qty by slider");
      if (parseInt(req.body.slideValue) >= 100) {
        console.log("eating all");
        res.send(
          JSON.stringify({
            success: true,
            finished: true,
            itemId: reqItem.id
          })
        );
        return;
      }
      mongoDb
        .collection(req.body.foodCol)
        .findOne({ uid }, (err, foodResult) => {
          if (err) {
            console.log(err);
            return;
          }
          let food = foodResult.data;
          let eatRatio = parseInt(req.body.slideValue) / 100;
          let updateItem = getFoodbyID(reqItem.id, food);
          let upI = food.indexOf(updateItem);
          updateItem.qty = updateItem.qty * (1 - eatRatio);
          food.splice(upI, 1, updateItem);
          mongoDb
            .collection(req.body.foodCol)
            .updateOne({ uid }, { $set: { data: food } }, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("food qty updated");
              res.send(JSON.stringify({ success: true }));
            });
        });
      return;
    }
    let eatQty = parseFloat(req.body.eatQty);
    let eatUnit = req.body.eatUnit;
    mongoDb.collection(req.body.foodCol).findOne({ uid }, (err, dbFood) => {
      if (err) {
        console.log(err);
      }
      let food = dbFood.data;
      let updateItem = getFoodbyID(reqItem.id, food);
      //console.log(updateItem);
      let upI = food.indexOf(updateItem);
      if (updateItem.unit.toLowerCase() != eatUnit.toLowerCase()) {
        let eatQtyC = convert.units(eatQty, eatUnit, updateItem.unit);
        if (isNaN(eatQtyC)) {
          res.send(
            JSON.stringify({
              success: false,
              msg: "could not convert between those units"
            })
          );
          return;
        }
        eatQty = eatQtyC;
      }
      updateQty(updateItem, upI, eatQty, food).then(uRes => {
        console.log("food qty update result");
        console.log(uRes);
        res.send(JSON.stringify(uRes));
      });
    });
  });
});
app.post("/delete-food", upload.none(), (req, res) => {
  console.log("POST /delete-food");
  let foodDb = req.body.collection;
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      mongoDb.collection(foodDb).findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
          res.send({ success: false, msg: "food container db read error" });
          throw err;
        }
        let foodCont = result.data;
        let removeItem = JSON.parse(req.body.delete);
        foodCont = foodCont.filter(item => {
          return item.id != removeItem.id;
        });
        mongoDb
          .collection(foodDb)
          .updateOne({ uid }, { $set: { data: foodCont } }, (err, result) => {
            if (err) {
              console.log(err);
              res.send(
                JSON.stringify({
                  success: false,
                  msg: "db write error for new food container"
                })
              );
              throw err;
            }
            console.log(result.result);
            res.send(JSON.stringify({ success: true }));
          });
      });
    } else {
      res.send(JSON.stringify({ success: false, msg: "no session found" }));
    }
  });
});
//Pantry Endponts ------------------------------------------------------------------------
app.get("/fetch-pantry", (req, res) => {
  console.log("GET: fetch-pantry");
  mongoDb
    .collection("sessions")
    .findOne({ sid: req.cookies.sid }, (err, session) => {
      if (err) {
        console.log(err);
        res.send(
          JSON.stringify({
            success: false,
            msg: "dbSession could not be found"
          })
        );
        return;
      }
      const uid = session.uid;
      mongoDb
        .collection("pantry")
        .find({ user: uid })
        .toArray((err, result) => {
          if (err) {
            console.log(err);
            res.send(
              JSON.stringify({
                success: false,
                msg: "error reading pantry from db"
              })
            );
            return;
          }
          let fridge = result;
          res.send(JSON.stringify({ success: true, data: fridge }));
        });
    });
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

app.get("/ocr", async (req, res) => {
  let time = new Date().getTime();
  let testFile = [];
  await fs.readFile("./testSet.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log("file opened, took " + (new Date().getTime() - time) + "ms");
    let testSet = JSON.parse(data);
    testSet.forEach(processScan);
  });
  //console.log(testFile);
});

app.get("/ocr-test", async (req, res) => {
  let testSet = [];
  let testImgs = [__dirname + "/uploads/skills.png"];
  /*for (let i = 0; i < 1; i++) {
    testImgs.push(__dirname + "/uploads/test" + i + ".jpg");
  }*/
  testSet = await Promise.all(
    testImgs.map(async imgFile => {
      console.log(imgFile.split("/") + " send");
      let time = new Date().getTime();
      let scanResult = await client.textDetection(imgFile);
      console.log(imgFile + " returned");
      console.log("response time: " + (new Date().getTime() - time));
      let detections = scanResult.map(result => {
        return result.fullTextAnnotation;
      });
      let lines = detections[0].text.split("\n");
      console.log(lines);
      return lines;
    })
  );
  let testSetJSON = JSON.stringify(testSet);
  fs.writeFile("./testSet.json", testSetJSON, err => {
    if (err) {
      console.log(err);
    }
    console.log("file written");
  });
});
// RECPIE SYSTEM ENDPOINTS ---------------------------------------------------------------------------
app.get("/get-recipe", (req, res) => {
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      mongoDb
        .collection("recipes")
        .findOne({ id: req.query.id }, (err, result) => {
          if (err) {
            console.log(err);
            res.send(
              JSON.stringify({
                success: false,
                msg: "recipe db read error" + req.query.id
              })
            );
            return;
          }
          if (result === null) {
            res.send(
              JSON.stringify({
                success: false,
                msg: "could not find db entry for recipe id" + req.query.id
              })
            );
            return;
          }
          res.send(JSON.stringify({ success: true, recData: result }));
        });
      return;
    }
    res.send(JSON.stringify({ success: false, msg: "no session found" }));
  });
});
app.get("/rec-library", (req, res) => {
  console.log("GET:/REC-LIBRARY");
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      mongoDb.collection("users").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
          res.send(
            JSON.stringify({ success: false, msg: "Database read error" })
          );
          return;
        }
        if (result === null) {
          res.send(
            JSON.stringify({
              success: false,
              msg: "No Recipe Library found for that user"
            })
          );
          return;
        }
        res.send(JSON.stringify({ success: true, recLib: result.recLibrary }));
      });
      return;
    }
    res.send(JSON.stringify({ success: false, msg: "no active user found" }));
  });
});
app.post("/recipe-add", upload.none(), (req, res) => {
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      console.log(req.body);
      let recData = JSON.parse(req.body.recData);
      recData.id = tools.generateId(10);
      let searchRec = {
        id: recData.id,
        title: recData.title,
        cat: recData.cat
      };
      mongoDb.collection("recipes").insertOne(recData, (err, result) => {
        if (err) {
          console.log(err);
        }
      });
      mongoDb.collection("users").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result === null) {
          //insert a new entry for the user
          console.log("user " + uid + " need db entry");
          let userData = {
            uid: uid,
            recLibrary: [searchRec]
          };
          mongoDb.collection("users").insertOne(userData, (err, result) => {
            if (err) {
              console.log(err);
              res.send(
                JSON.stringify({
                  success: false,
                  msg: "new user db write failed"
                })
              );
            }
            res.send(JSON.stringify({ success: true, recId: recData.id }));
          });
          return;
        }
        recipes = result.recLibrary;
        recipes.push(searchRec);
        mongoDb
          .collection("users")
          .updateOne(
            { uid },
            { $set: { recLibrary: recipes } },
            (err, result) => {
              if (err) {
                console.log(err);
                res.send(
                  JSON.stringify({
                    success: false,
                    msg: "writing new recipe to db failed"
                  })
                );
                return;
              }
              res.send(JSON.stringify({ success: true, recId: recData.id }));
            }
          );
      });
      return;
    }
    res.send(JSON.stringify({ success: false, msg: "no session found" }));
  });
});
app.get("/rec-cats", (req, res) => {
  console.log("GET: /rec-cats");
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      mongoDb.collection("users").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
          res.send(
            JSON.stringify({ success: false, msg: "database read error" })
          );
          return;
        }
        if (result === null) {
          console.log("no user");
          res.send(JSON.stringify({ success: false, msg: "no user founds" }));
        }
        if (result.recCats === undefined) {
          mongoDb.collection("users").updateOne(
            { uid },
            {
              $set: { recCats: ["lunch", "dinner", "breakfast", "dessert"] }
            },
            (err, result) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        console.log("user data retreived");
        res.send(JSON.stringify({ success: true, cats: result.recCats }));
      });
      return;
    }
    res.send(JSON.stringify({ success: false, msg: "no active user found" }));
  });
});
app.post("/edit-cats", upload.none(), (req, res) => {
  console.log("POST /edit-cats");
  findUIDbySID(req.cookies.sid).then(session => {
    if (session.success) {
      const uid = session.uid;
      let action = req.body.action;
      console.log(action);
      mongoDb.collection("users").findOne({ uid }, (err, result) => {
        if (err) {
          console.log(err);
          //send db read error
        }
        if (result === null) {
          console.log("no user found");
          // send no user error
        }
        let oldCats = result.recCats;
        let newName = req.body.category;
        let editCat = req.body.editCat;
        let newCats = oldCats;
        if (action === "add") {
          console.log("adding " + newName);
          newCats = oldCats.concat(newName);
        }
        if (action === "edit") {
          let i = oldCats.indexOf(editCat);
          oldCats.splice(i, 1, newName);
          newCats = oldCats;
        }
        if (action === "delete") {
          newCats = oldCats.filter(name => {
            return name != editCat;
          });
        }
        mongoDb
          .collection("users")
          .updateOne({ uid }, { $set: { recCats: newCats } }, (err, result) => {
            if (err) {
              console.log(err);
            }
            res.send(JSON.stringify({ success: true, recCats: newCats }));
          });
      });

      return;
    }
    res.send(
      JSON.stringify({ success: false, msg: "no active session found" })
    );
  });
});
// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
  //console.log(keyPath);
});
