const convert = require("../utilites/unitConverter.js");

it("should turn 1 cup into 250 mL", () => {
  let amount = 1;
  let startUnit = "cup";
  let targetUnit = "mL";
  let converted = convert.units(amount, startUnit, targetUnit);
  expect(converted).toBe(250);
});
it("should turn 50 mL into 0.2 cup", () => {
  let converted = convert.units(50, "mL", "cup");
  expect(converted).toBeCloseTo(0.2);
});
it("should have an error if converting between volume and mass", () => {
  let converted = convert.units(50, "mL", "g");
  expect(converted).toBe(NaN);
});
