const convertClones = require("./lib/index.js");

module.exports = {
  js2svg: {
    indent: 2,
    pretty: true,
  },
  plugins: [convertClones],
};
