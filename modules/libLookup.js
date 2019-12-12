const libLookup = (itemName, mongoDb) => {
  const iterateSearch = async wordArr => {
    console.log("searching advanced");
    const search = keyword => {
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
      searchResult.forEach(resultArr => {
        if (resultArr.length > 0) {
          result = result.concat(resultArr);
        }
      });
      if (result.length === 1) {
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
  let searchRes = new Promise((resolve, reject) => {
    mongoDb
      .collection("lib")
      .find({ names: longStr })
      .toArray((err, result) => {
        console.log(longStr + " results " + result);
        if (err) {
          console.log(err);
        }
        if (result.length === 1) {
          resolve(result[0]);
        }
        let fullSearch = result;
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
            if (advResult.length > 0) {
              resolve(advResult[0]);
              return;
            }
            resolve(false);
          });
        });
      });
  });
  return searchRes;
};

module.exports = { libLookup };
