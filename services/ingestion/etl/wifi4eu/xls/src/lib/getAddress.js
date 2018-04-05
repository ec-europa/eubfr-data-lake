/**
 * Returns an address of the form of street + street number
 *
 * For address/street number, ignores the following:
 * - trashStrings: na, snc, S/n, dots, dashes, and other custom means to say data is not available
 * - phone numbers,: items with more than 8 digits, in any syntax
 * - string-only values: Pi, NR, etc.
 *
 * @Todo: improve concatenation logic using street number/address, wherever possible
 *
 * Example: `Karl-Marx-Str. 36` is address, and `12061540` is address num -> take only address
 * Example: `14 rue du stade` is address, and `565696509` is address num -> take only address
 * Example: `гр. Балчик, пл. „21-ви септември“` and `6` -> concatenate
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String} The address
 */
export default record => {
  let address = '';
  let addressNumber = '';
  const addressStreet = record.address || '';

  const trashStrings = [
    's/n',
    'snc',
    'SNC',
    'S/n',
    'S/N',
    's/N',
    'SN',
    'NA',
    'na',
    'n/a',
    'N/A',
    '-',
    'n.a.',
    'na',
    '.',
  ];

  const addressNum = record['address num'].trim();
  const numberContainsTrash = trashStrings.includes(addressNum);
  const numberIsOnlyLetters = addressNum.match(/^[a-z]+$/i)
    ? addressNum.match(/^[a-z]+$/i).length
    : false;
  const numberIsPhoneNumber = addressNum.match(/\d/g)
    ? addressNum.match(/\d/g).length >= 6
    : false;

  if (!numberContainsTrash && !numberIsOnlyLetters && !numberIsPhoneNumber) {
    addressNumber = record['address num'];
  }

  if (addressStreet && addressNumber) {
    address = `${addressStreet.trim()} ${addressNumber}`;
  } else {
    address = addressStreet;
  }

  return address;
};
