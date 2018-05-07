// @flow

/**
 * Counts fields occurences.
 *
 * @param {Object} analyzedObject
 * @param {Object} results The outcome of the analysis
 *
 * @returns {Object} The results for the report.
 *
 */
const counter = (analyzedObject: Object): Object => {
  const results = {};

  analyzedObject.forEach(field => {
    // existing field
    if (results[field]) {
      results[field] += 1;
      // new field
    } else {
      results[field] = 1;
    }
  });

  return results;
};

/**
 * Flags whether a given value is useful or not.
 *
 * @param {Object} input The object for analysis.
 * @param {number} numRecords The number of overall occurences known outside of the scope of this function.
 *
 * @returns {Object} The results for the report.
 *
 */
const getCoverageReport = (
  input: Object,
  numRecords: number
): Array<Object> => {
  if (!input) {
    return [{}];
  }

  const results = counter(input);

  return Object.keys(results).map(field => {
    // Divide the number of occurences by the overall number of records
    const fieldCoverage = (results[field] / numRecords * 100).toFixed(2);

    return {
      [field]: results[field],
      coverage: fieldCoverage,
    };
  });
};

export default getCoverageReport;
