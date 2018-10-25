/**
 * Get concrete currency out of {currencyData}.
 * @param  {Object} data {currencyData} input
 * @return {String}      The actual currency.
 */
const getCurrency = data => {
  const hasNormalCurrency = data.normal && data.normal.length;
  const hasNormalMultple = hasNormalCurrency && data.normal.length > 1;
  const hasSymbolicCurrency = data.symbolic && data.symbolic.length;
  const hasSymbolicMultiple = hasSymbolicCurrency && data.symbolic.length > 1;

  if (hasNormalCurrency && !hasNormalMultple && !hasSymbolicCurrency) {
    // eslint-disable-next-line
    return data.normal[0];
  }

  if (hasSymbolicCurrency && !hasSymbolicMultiple && !hasNormalCurrency) {
    // If textual currencies haven't been found yet, try also symbolic ones.
    const symbolsMap = {
      '€': 'EUR',
      '£': 'GBP',
      '\\$': 'USD',
    };

    const symbol = data.symbolic[0];

    // Dollar needs to be escaped for the regex, but can't be found back from object.
    if (symbol === '$') {
      return 'USD';
    }
    return symbolsMap[symbol];
  }

  return '';
};

module.exports = getCurrency;
