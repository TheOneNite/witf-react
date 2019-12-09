const libLookup = require("../libLookup.js").libLookup;
const dbConnect = require("../mongo/connect.js");
mongoDb = undefined;

beforeAll(async done => {
  mongoDb = await dbConnect();
  done();
});

it("should search the library with the recipt string", async () => {
  let testName = "POIVRONS ROUGES DE SERRE";
  let result = await libLookup(testName, mongoDb);
  console.log(result);
  expect(result.foodId).toBe("pqqvehguax");
});
