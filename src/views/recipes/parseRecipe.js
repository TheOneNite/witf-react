//uncomment for frontend
import units from "../../assets/units.js";
//const units = require("../../../backend/utilites/units.js");

const parseRec = inputStr => {
  const checkFractions = str => {
    const fracs = ["½", "⅓", "⅔", "¼", "¾", "⅛"];
    const convert = {
      "½": 0.5,
      "⅓": 1 / 3,
      "⅔": 2 / 3,
      "¼": 0.25,
      "¾": 0.75,
      "⅛": 1 / 8
    };
    if (!fracs.includes(str)) {
      return false;
    }
    return convert[str];
  };
  const trashWords = ["of", "a", "x"];
  let ingList = [];
  let lines = inputStr.split("\n");
  lines = lines.filter(line => {
    return line.length > 1;
  });
  lines.forEach(lineStr => {
    let ing = {};
    let qtyI = undefined;
    let unitI = undefined;
    let nameI = undefined;
    let words = lineStr.split(" ");
    words = words.filter(word => {
      return word.length > 0;
    });
    let unitHits = words.filter(word => {
      word = word.toLowerCase();
      const suffixChars = [".", "s"];
      const trimEnd = str => {
        console.log("check unit", str);
        if (suffixChars.includes(str[str.length - 1])) {
          word = str.slice(0, str.length - 1);
          return true;
        } else {
          return false;
        }
      };
      if (units.includes(word)) {
        return true;
      }
      while (trimEnd(word)) {
        if (units.includes(word)) {
          return true;
        }
        console.log(word);
      }
      return false;
    });
    console.log("possible units", unitHits);
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (isNaN(parseInt(word))) {
        //console.log("letter word " + word);
        if (checkFractions(word)) {
          //console.log("fraction" + word);
          if (ing.qty === undefined) {
            ing.qty = checkFractions(word) + "";
            qtyI = i;
          }
        } else {
          //console.log("unit " + ing.unit);
          if (ing.unit === undefined && unitHits.includes(word)) {
            ing.unit = word;
            unitI = i;
          } else {
            nameI = i;
            break;
          }
        }
        //triggers for letters
      } else {
        //triggers for numbers
        if (ing.qty === undefined) {
          ing.qty = word;
          qtyI = i;
        }
      }
    }
    if (unitHits.length < 1) {
      ing.unit = undefined;
    }
    if (ing.unit === undefined && unitHits.length === 1) {
      ing.unit = unitHits[0];
    }
    if (ing.qty === undefined) {
      ing.qty = "";
    }
    let nameArr = words.slice(nameI, words.length);
    if (trashWords.includes(nameArr[0])) {
      nameArr = nameArr.slice(1, nameArr.length);
    }
    if (ing.unit === "cloves" && nameArr.includes("cloves")) {
      ing.unit = undefined;
      nameArr = nameArr.filter(word => {
        console.log(word);
        return word != ing.qty;
      });
    }
    ing.name = nameArr.join(" ");
    //console.log(ing);
    ingList.push(ing);
  });
  //console.log(ingList);
  return ingList;
};

//module.exports = recipeParser;
export default parseRec;
