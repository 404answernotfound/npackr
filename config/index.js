var configs = {};

try {
  const generatedByUser = require("./generatedByUser.json");
  configs = generatedByUser;
} catch (error) {
  console.log(error);
}

module.exports = configs;
