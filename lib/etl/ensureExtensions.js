const path = require('path');

/**
 *
 * Check whether a given `file` is of any of the allowed `extensions`.
 *
 * @param {Object} params Input settings.
 * @param {String} params.file The input file to check for a given set of extensions.
 * @param {Array<String>} params.extensions List of allowed items, lowercase version is enough.
 *
 * @returns {Boolean}
 *
 * @example
 *
 * if (!ensureExtensions({ file: key, extensions: ['.csv'] })) {}
 *
 */
const ensureExtensions = ({ file, extensions }) => {
  // Allow for `file` with extension of `.CSV` or `.Csv` to be specified simply with a single `extension` of `.csv`
  const extension = path.extname(file).toLocaleLowerCase();

  const match = extensions.find(
    allowedExtension => allowedExtension === extension
  );

  if (match) {
    return true;
  }

  return false;
};

module.exports = ensureExtensions;
