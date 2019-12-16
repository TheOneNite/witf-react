const tools = require("../backend/utilites/tools.js");
const libLookup = (itemName, mongoDb) => {
  const trashWords = ["de"];
  const iterateSearch = async wordArr => {
    console.log("searching advanced");
    const search = keyword => {
      keyword = new RegExp(keyword);
      let result = new Promise((resolve, reject) => {
        mongoDb
          .collection("lib")
          .find({ names: keyword })
          .toArray((err, result) => {
            if (err) {
              resolve([]);
              return;
            }
            resolve(result);
          });
      });
      return result;
    };
    let searchTerms = [];
    for (let i = 0; i < wordArr.length; i++) {
      let front = wordArr[i];
      for (let j = 0; j < wordArr.length; j++) {
        if (i != j) {
          //console.log("searching " + front + wordArr[j]);
          searchTerms.push(front + wordArr[j]);
        }
      }
    }
    let result = [];
    let final = await Promise.all(
      searchTerms.map(async searchWord => {
        //console.log("searching " + searchWord);
        let result = await search(searchWord);
        //console.log(searchWord + "...search returned");
        return result;
      })
    ).then(searchResult => {
      //console.log(searchResult);
      searchResult.forEach(resultArr => {
        if (resultArr.length > 0) {
          result = result.concat(resultArr);
        }
      });
      if (result.length > 0) {
        return result;
      }
      return [];
    });
    return final;
  };
  let words = itemName.split(" ");
  words = words.map(word => {
    return word.toLowerCase();
  });
  console.log(words);
  let longStr = words.join("");
  let searchStr = new RegExp(longStr);
  let searchRes = new Promise((resolve, reject) => {
    mongoDb
      .collection("lib")
      .find({ names: searchStr })
      .toArray((err, result) => {
        console.log(longStr + " results ");
        console.log(result);
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          resolve(result);
        }
        let fullSearch = result;
        words = words.filter(word => {
          if (trashWords.includes(word)) {
            return false;
          }
          return true;
        });
        Promise.all(
          words.map(lookup => {
            let result = new Promise((resolve, reject) => {
              mongoDb
                .collection("lib")
                .find({ names: lookup.toLowerCase() })
                .toArray((err, result) => {
                  //console.log(result);
                  if (err) {
                    console.log(err);
                    resolve([]);
                  }
                  resolve(result);
                });
            });
            return result;
          })
        ).then(searchResult => {
          if (searchResult.length + fullSearch.length < 1) {
            mongoDb
              .collection("lib")
              .findOne({ imgPath: "missing" }, (err, result) => {
                if (err) {
                  console.log(err);
                }
                let missingPics = result.names;
                missingPics = missingPics.concat(itemName);
                mongoDb
                  .collection("lib")
                  .updateOne(
                    { imgPath: "missing" },
                    { $set: { names: missingPics } },
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        throw err;
                      }
                      resolve(false);
                    }
                  );
              });
          }
          searchResult = searchResult.filter(arr => {
            if (arr.length < 1) {
              return false;
            }
            return true;
          });
          let wordSearch = [];
          searchResult.forEach(arr => {
            wordSearch = wordSearch.concat(arr);
          });
          if (wordSearch.length === 1) {
            resolve(wordSearch[0]);
          }
          if (wordSearch.length > 1) {
            return wordSearch;
            let longArr = undefined;
            let shortArr = undefined;
            if (wordSearch.length > fullSearch.length) {
              longArr = wordSearch;
              shortArr = fullSearch;
            } else {
              shortArr = wordSearch;
              longArr = fullSearch;
            }
            intersect = longArr.filter(result => {
              let match = false;
              for (let i = 0; i < shortArr.length; i++) {
                if (shortArr[i].foodId === result.Id) {
                  match = true;
                }
              }
              return match;
            });
            if (intersect.length === 1) {
              return intersect[0];
            }
          }
          iterateSearch(words).then(advResult => {
            if (advResult.length > 1) {
              resolve(advResult);
              return;
            }
            resolve(false);
          });
        });
      });
  });
  return searchRes;
};

const updateLibrary = (mongoDb, fs) => {
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
};

module.exports = { libLookup, updateLibrary };
