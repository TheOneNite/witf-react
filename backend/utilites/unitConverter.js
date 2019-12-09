const fs = require("fs");

const units = (amount, start, target) => {
  console.log("converting from " + start);
  console.log("to " + target);
  const data = fs.readFileSync(__dirname + "/conversionsList.json", "utf8");
  const conversions = JSON.parse(data);
  let factorSearch = conversions.filter(factor => {
    if (factor.large === start && factor.small === target) {
      return true;
    }
    if (factor.small === start && factor.large === target) {
      return true;
    }
  });
  console.log(factorSearch);
  if (factorSearch.length < 1) {
    return NaN;
  }
  let factor = factorSearch[0];
  if (isNaN(parseInt(factor.factor))) {
    console.log("invalid conversion");
    return NaN;
  }
  if (factor.large === start) {
    console.log("convering up by factor of");
    console.log(factor.factor);
    return amount * factor.factor;
  } else {
    console.log("converting down by factor of" + factor.factor);

    return amount / factor.factor;
  }
};

const getSize = (unit1, unit2) => {
  const data = fs.readFileSync(__dirname + "/conversionsList.json", "utf8");
  conversions = JSON.parse(data);
};

module.exports = { units, getSize };
