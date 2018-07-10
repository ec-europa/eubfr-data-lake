module.exports = (required, haystack) => {
  const missing = required.find(variable => !haystack[variable]);

  if (missing) {
    console.error(`${missing} environment variable is missing.`);
    process.exit(1);
  }
};
