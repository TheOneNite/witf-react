const generateId = length => {
  const base = "abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < length; i++) {
    index = Math.floor(Math.random() * 26);
    id = id + base[index];
  }
  return id;
};

module.exports = { generateId };
