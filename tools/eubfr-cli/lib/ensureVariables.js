module.exports = (required, haystack) =>
  required.find(variable => !haystack[variable]);
