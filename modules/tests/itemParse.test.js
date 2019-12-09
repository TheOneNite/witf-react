const ocrMod = require("../recipt-ocr.js");

test("should turn a line of text into an item with name, quantity, and unit", () => {
  const testLine = "POIVRONS ROUGES DE SI RRE 1KG $1.01 e";
  let item = ocrMod.itemParse(testLine);
  expect(item).toEqual({
    name: "POIVRONS ROUGES DE SI RRE ",
    qty: 1,
    unit: "KG"
  });
});
