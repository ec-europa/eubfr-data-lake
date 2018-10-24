const getAllCurrencies = require('./getAllCurrencies');

const currencies = getAllCurrencies();

/**
 * Get quantative data about currencies.
 * @param  {String} inputString The input string to check for currency data.
 * @return {Object}             The result containing currency data.
 */
const getCurrenciesPresent = inputString => {
  const currenciesPresent = {
    normal: 0,
    symbolic: 0,
  };

  // Get information about currencies in normal textual form: EUR, ECU, etc.
  const currenciesList = currencies.join('|');
  const currenciesPattern = new RegExp(`\\b(${currenciesList})\\b`, 'gi');
  const currenciesMatches = inputString.match(currenciesPattern);

  currenciesPresent.normal = currenciesMatches ? currenciesMatches.length : 0;

  // If textual currencies haven't been found yet, try also symbolic ones.
  const symbolsMap = {
    '€': 'EUR',
    '£': 'GBP',
    '\\$': 'USD',
  };

  const currenciesSymbolic = Object.keys(symbolsMap).join('|');
  const currenciesSymPatt = new RegExp(currenciesSymbolic, 'gi');
  const currenciesMatchesSymbolic = inputString.match(currenciesSymPatt);

  currenciesPresent.symbolic = currenciesMatchesSymbolic
    ? currenciesMatchesSymbolic.length
    : 0;

  return currenciesPresent;
};

module.exports = getCurrenciesPresent;
