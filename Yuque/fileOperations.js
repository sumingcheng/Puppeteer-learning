const fs = require('fs');
const path = require('path');

function ensureOutputDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function saveToFile(directory, fileName, content) {
  const filePath = path.join(directory, fileName);
  fs.writeFileSync(filePath, content);
}

module.exports = {
  ensureOutputDirectory,
  saveToFile
};
