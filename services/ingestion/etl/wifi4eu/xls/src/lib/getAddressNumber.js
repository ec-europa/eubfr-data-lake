/**
 * Returns an address number
 *
 * Ignores the following:
 * - trash: na, snc, S/n, dots, dashes, and other custom means to say data is not available
 * - phone numbers,: items with more than 8 digits, in any syntax
 * - string-only values: Pi, NR, etc.
 *
 * @memberof Wifi4EuXlsTransform
 * @param {Object} record The row received from parsed file
 * @returns {String} The address number
 */
export default record => {
  let addressNumber = '';

  const trash = [
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

  const address = record['address num'].trim();
  const containsTrash = trash.includes(address);
  const isOnlyLetters = address.match(/^[a-z]+$/i)
    ? address.match(/^[a-z]+$/i).length
    : false;
  const isPhoneNumber = address.match(/\d/g)
    ? address.match(/\d/g).length >= 8
    : false;

  if (containsTrash || isOnlyLetters || isPhoneNumber) {
    // Return empty string
    return addressNumber;
  }

  addressNumber = record['address num'];

  return addressNumber;
};
