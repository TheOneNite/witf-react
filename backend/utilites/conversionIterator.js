const units = require("./units.js");
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
        let newConvert = {
          unit1: unit,
          unit2: unit2,
          factor: 1
        };
        console.log(newConvert);
        conversions.push(newConvert);
      }
    }
  }
});

fs.writeFile(
  __dirname + "/conversionsList.json",
  JSON.stringify(conversions, undefined, "\t"),
  err => {
    if (err) {
      console.log(err);
    }
  }
);
