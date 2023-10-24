const util = require('util');

function formatObject(obj) {
  console.log(util.inspect(obj, {depth: null, colors: true}));
}

function formatTitle(title) {
  return title.replace(/[\/\\?%*:|"<>]/g, '-');
}

module.exports = {
  formatObject,
  formatTitle
};
