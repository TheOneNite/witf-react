const itemParse = line => {
  const specChars = [".", " "];
  let name = "";
  let qty = undefined;
  let unit = undefined;
  let toggle = false;
  let itemI = 0;
  let qtyI = 0;
  let unitI = 0;
  for (let i = 0; i < line.length; i++) {
    if (!isNaN(parseInt(line[i]))) {
      //actions if character is a number
      if (!toggle) {
        //toggle is true when looking for end of qty
        itemI = i;
        name = line.slice(0, i);
        console.log("found item name " + name);
        toggle = true;
      }
    } else {
      //actions if char is not a number
      if (toggle) {
        //triggered on first non-number once qty has been found
        if (!specChars.includes(line[i])) {
          qtyI = i;
          toggle = false;
          let foundQty = line.slice(itemI, qtyI);
          if (isNaN(parseInt(foundQty))) {
            qty = foundQty;
          } else {
            qty = parseInt(foundQty);
          }
        }
      }
      if (qtyI > 0) {
        //triggers if qty has been found
        if (line[i] === " ") {
          unitI = i;
          unit = line.slice(qtyI, unitI);
          break;
        }
      }
    }
  }
  //console.log("itemOUT: " + name);
  //console.log("qtyOUT: " + qty);
  if (qty < 1) {
    qty = 1;
  }
  if (unitI < 1) {
    unit = line.slice(qtyI, line.length);
  }
  if (unit) {
    return {
      name: name,
      qty: qty,
      unit: unit
    };
  }
  return { name: name, qty: qty };
};

module.exports = { itemParse };
