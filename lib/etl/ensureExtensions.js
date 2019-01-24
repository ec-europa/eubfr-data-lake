const path = require('path');

const ensureExtensions = ({ file, extensions }) => {
  const extension = path.extname(file);

  const match = extensions.find(
    allowedExtension => allowedExtension === extension
  );

  if (match) {
    return true;
  }

  return false;
};

module.exports = ensureExtensions;
