export const isStringNotEmpty = source =>
  Object.prototype.toString.call(source) === '[object String]' &&
  source.trim().length > 0;

/**
 * Normalize string for DynamoDB.
 * @param  {string} source The string to normalize.
 * @return {object}        The normalized string object or null if the source is not a string or if it is empty.
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
 * @return {object}        The normalized number object or null if the source is not a finite number.
 */
export const normalizeNumber = source =>
  Number.isFinite(source)
    ? {
        N: source.toString(),
      }
    : null;

/**
 * Normalize string set for DynamoDB.
 * @param  {array} source The string set to normalize.
 * @return {object}       The normalized string set or null if the source is not a string set or if it is empty.
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

export const normalizeMap = source => ({
  M: source,
});

export const normalizeList = source =>
  Array.isArray(source) && source.length > 0
    ? {
        L: source,
      }
    : null;
