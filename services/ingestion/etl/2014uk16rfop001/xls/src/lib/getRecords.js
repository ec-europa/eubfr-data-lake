import improveObjectKeys from './improveObjectKeys';

/**
 * Takes raw parsed rows from XLSX.utils.sheet_to_json(sheet) and returns well-formatted records for transform functions.
 *
 * @param {Object} Should contain `rows` ({Array<Object>}) and `type` ({String})
 * @returns {Array<Object>} Improved list of records.
 */
const getRecords = ({ rows, type }) => {
  const records = [];

  switch (type) {
    case 'ESF': {
      // First row is the header.
      const headerRow = rows.shift();
      // Remove row with information in Polish.
      rows.shift();

      // Normalize the list by replacing properties
      rows
        .map(record => {
          const mapped = {};
          Object.keys(record).forEach(prop => {
            mapped[headerRow[prop]] = record[prop];
          });
          return mapped;
        })
        .map(improveObjectKeys)
        .forEach(record => records.push(record));

      break;
    }
    case 'ESIF':
      break;

    default:
      break;
  }

  return records;
};

export default getRecords;
