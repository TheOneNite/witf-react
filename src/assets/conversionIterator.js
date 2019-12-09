const units = require("../assets/units.js");
const fs = require("fs");

let conversions = [];
units.forEach(unit => {
  for (let i = 0; i < units.length; i++) {
    let unit2 = units[i];
    if (unit2 != unit) {
      let search = conversions.filter(factor => {
        return factor.unit2 === unit && factor.unit1 === unit2;
      });
      if (search.length < 1) {
        conversions.push({
          unit1: unit,
          unit2: unit2,
          factor: 1
        });
      }
    }
  }
});

fs.writeFile(__dirname + "/conversionsList.js", conversions, err => {
  if (err) {
    console.log(err);
  }
});
