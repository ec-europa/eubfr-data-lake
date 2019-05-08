import improveObjectKeys from './improveObjectKeys';

/**
 * Takes raw parsed rows from XLSX.utils.sheet_to_json(sheet) and returns well-formatted records for transform functions.
 *
 * @param {Object} Should contain `rows` ({Array<Object>}) and `type` ({String})
 * @returns {Array<Object>} Improved list of records.
 */
const getRecords = ({ rows, type }) => {
  let headerRow = {};
  const records = [];

  switch (type) {
    case 'ESF': {
      // First row is the header.
      headerRow = rows.shift();
      // Remove row with information in Polish.
      rows.shift();

      break;
    }

    case 'ESIF': {
      // The first few rows contain explanations.
      rows.shift();
      rows.shift();

      // English version of the columns.
      headerRow = rows.shift();
      // French version
      rows.shift();

      break;
    }

    default:
      break;
  }

  // Normalize the list by replacing properties
  rows
    .map(record => {
      const remapped = {};

      Object.keys(record).forEach(prop => {
        remapped[headerRow[prop]] = record[prop];
      });

      return remapped;
    })
    .map(improveObjectKeys)
    .forEach(record => records.push(record));

  return records;
};

export default getRecords;
