/**
 * Checks whether an input string contains characters of an unclear input.
 * @param  {String}  inputString The string to check.
 * @return {Boolean}             Whether the inputString contains forbidden characters.
 */
const hasUnsupportedCharacters = inputString => {
  const unsupportedList = [':', '/', '-', '+'];

  return unsupportedList.find(s => {
    const parts = inputString.split(s);
    if (parts.length > 1) return true;
    return false;
  });
};

module.exports = hasUnsupportedCharacters;
