const getAllCurrencies = require('./getAllCurrencies');

const currencies = getAllCurrencies();

/**
 * Get quantative data about currencies.
 * @param  {String} inputString  The input string to check for currency data.
 * @return {Object} currencyData The result containing currency data.
 */
const getCurrencyData = inputString => {
  const result = {
    normal: null,
    symbolic: null,
  };

  // Get information about currencies in normal textual form: EUR, ECU, etc.
  const currenciesList = currencies.join('|');
  const currenciesPattern = new RegExp(`\\b(${currenciesList})\\b`, 'gi');
  const currenciesMatches = inputString.match(currenciesPattern);

  result.normal = currenciesMatches;

  // If textual currencies haven't been found yet, try also symbolic ones.
  const symbolsMap = {
    '€': 'EUR',
    '£': 'GBP',
    '\\$': 'USD',
  };

  const currenciesSymbolic = Object.keys(symbolsMap).join('|');
  const currenciesSymPatt = new RegExp(currenciesSymbolic, 'gi');
  const currenciesMatchesSymbolic = inputString.match(currenciesSymPatt);

  result.symbolic = currenciesMatchesSymbolic;

  return result;
};

module.exports = getCurrencyData;
