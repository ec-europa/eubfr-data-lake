/**
 * Utility to extract useful information from a parsed XLSX file.
 *
 * @param {Array} parsedRows
 * @returns {Array}
 */
const getRecords = parsedRows => {
  const records = [];

  // Remove a few unnecessary rows with information which is not useful.
  parsedRows.shift();
  parsedRows.shift();
  parsedRows.shift();
  parsedRows.shift();

  const columnsMap = parsedRows.shift();

  // Work with the rest of the data.
  parsedRows.map(row => {
    const improvedRow = {};

    // Re-map keys.
    const rowKeys = Object.keys(row);

    rowKeys.forEach(columnKey => {
      if (columnsMap[columnKey]) {
        const columnName = columnsMap[columnKey].trim();
        improvedRow[columnName] = row[columnKey];
      }
    });

    records.push(improvedRow);
  });

  return records;
};

export default getRecords;
