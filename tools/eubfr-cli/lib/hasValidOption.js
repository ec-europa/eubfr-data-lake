// If -p or -d, or any other `needle` option is passed
// without an actual value, it will be boolean true
// This helper ensures that `needle` option is something useful.
module.exports = (needle, haystack) =>
  haystack[needle] && typeof haystack[needle] !== 'boolean';
