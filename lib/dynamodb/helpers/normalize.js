/**
 * Test if it is a string and if the string is not empty.
 * @param  {string}  str The string to test.
 * @return {boolean}     Return true if it is a string and if the string is not empty.
 */
export const isStringNotEmpty = str =>
  Object.prototype.toString.call(str) === '[object String]' &&
  str.trim().length > 0;

/**
 * Normalize string for DynamoDB.
 * @param  {string} source The string to normalize.
 * @return {Object}        The normalized string object or null if the source is not a string or if it is empty.
 */
export const normalizeString = source =>
  isStringNotEmpty(source)
    ? {
        S: source.trim(),
      }
    : null;

/**
 * Normalize number for DynamoDB.
 * @param  {number} source The number to normalize.
 * @return {Object}        The normalized number object or null if the source is not a finite number.
 */
export const normalizeNumber = source =>
  Number.isFinite(source)
    ? {
        N: source.toString(),
      }
    : null;

/**
 * Normalize string set for DynamoDB.
 * @param  {string[]} source The string set to normalize.
 * @return {Object}          The normalized string set or null if the source is not a string set or if it is empty.
 */
export const normalizeStringSet = source => {
  if (Array.isArray(source) && source.length > 0) {
    const normalizedSource = source
      .map(item => (isStringNotEmpty(item) ? item.trim() : null))
      .filter(item => item !== null);

    if (normalizedSource.length > 0) {
      return {
        SS: normalizedSource,
      };
    }
  }

  return null;
};

/**
 * Normalize a map for DynamoDB.
 * @param  {Object} source The object to normalize.
 * @return {Object}        The normalized object.
 */
export const normalizeMap = source => ({
  M: source,
});

/**
 * Normalize a list for DynamoDB.
 * @param  {Array}  source The array to normalize.
 * @return {Object}        The normalized array or null if the source is not an array or if it is an empty array.
 */
export const normalizeList = source =>
  Array.isArray(source) && source.length > 0
    ? {
        L: source,
      }
    : null;
