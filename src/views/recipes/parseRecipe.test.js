const parser = require("./parseRecipe.js");

it("should turn a string list of ingredients into an array of food item objects", () => {
  const testInput = `20 g dried porcini mushrooms
  5 beef cheeks , trimmed
  olive oil
  150 g piece of higher-welfare smoked pancetta
  ½ a celery heart 
  2 red onions
  2 carrots
  5 cloves
  8 cloves of garlic
  ½ a cinnamon stick
  1 bunch of mixed fresh herbs (30g) , such as sage, bay, rosemary, thyme, basil, parsley
  500 ml Barolo red wine
  1 x 680 g jar of passata`;
  let output = parser(testInput);
  expect(output).toEqual([
    { name: "dried porcini mushrooms", qty: "20", unit: "g" },
    { name: "beef cheeks , trimmed", qty: "5", unit: undefined },
    { name: "olive oil", qty: "", unit: undefined },
    { name: "piece of higher-welfare smoked pancetta", qty: "150", unit: "g" },
    { name: "celery heart", qty: "0.5", unit: undefined },
    { name: "red onions", qty: "2", unit: undefined },
    { name: "carrots", qty: "2", unit: undefined },
    { name: "cloves", qty: "5", unit: undefined },
    { name: "garlic", qty: "8", unit: "cloves" },
    { name: "cinnamon stick", qty: "0.5", unit: "stick" },
    {
      name:
        "mixed fresh herbs (30g) , such as sage, bay, rosemary, thyme, basil, parsley",
      qty: "1",
      unit: "bunch"
    },
    { name: "Barolo red wine", qty: "500", unit: "ml" },
    { name: "680 g jar of passata", qty: "1", unit: undefined }
  ]);
});
