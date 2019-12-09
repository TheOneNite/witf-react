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

exports.cleanup = cleanup;
