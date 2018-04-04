/**
 * Returns an address number.
 *
 * Operations:
 * - remove phone numbers (items starting with + sign)
 * - remove items which are string only, Pi, NR, etc.
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
