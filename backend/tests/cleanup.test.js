let cleanup = require("../modules/cleanup.js");
let words = ["0abcdef", "abcdef", "ghijk"];

test("removes strings with leading numbers", () => {
  expect(cleanup(words)).toEqual(["abcdef", "ghijk"]);
});
