import improveObjectKeys from './improveObjectKeys';

/**
 * Because the contents of the incoming XLS file can vary, this utility will help figuring out which transform function to use.
 * Only the first 2 items of the `sheet` array are used, as always they contain background information or leading header row which suffice to know the contents of the whole XLS file.
 *
 * @param {Array<Object>} sheet Contains result of XLSX.utils.sheet_to_json(sheet)
 * @returns {String} The type of incoming XLS file. Could be an empty, 'ESF' or 'ESIF'
 */
const getFundingType = sheet => {
  let type = '';
  const first = improveObjectKeys(sheet[0]);
  const second = improveObjectKeys(sheet[1]);

  if (
    first['LIST OF OPERATIONSWYKAZ OPERACJI'] &&
    first['LIST OF OPERATIONSWYKAZ OPERACJI'] === 'Beneficiary Name' &&
    second['LIST OF OPERATIONSWYKAZ OPERACJI'] &&
    second['LIST OF OPERATIONSWYKAZ OPERACJI'] === 'Nazwa Odbiorcy'
  ) {
    type = 'ESF';
  }

  if (
    first.__EMPTY_1 &&
    first.__EMPTY_1 ===
      'EUROPEAN STRUCTURAL AND INVESTMENT FUNDS LIST OF OPERATIONS 2014 TO 2020' &&
    second.__EMPTY &&
    second.__EMPTY === 'Last updated January 2019'
  ) {
    type = 'ESIF';
  }

  return type;
};

export default getFundingType;
