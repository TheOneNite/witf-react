const addItem = itemData => {
  const imgPrefix = "/foodAssets";
  mongoDb.collection("lib").findOne({ names: itemData.name }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (result === null) {
      console.log("no library item found for that food");
      //itemData.imgPath = "/noImg.jpg"
      return;
    }
    itemData.imgPath = imgPrefix + result.imgPath;
    console.log("added image path: " + itemData.imgPath);
  });
  return itemData;
};

module.exports = { addItem };
