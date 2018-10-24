const getCurrenciesPresent = require('./getCurrenciesPresent');
const getCurrencyData = require('./getCurrencyData');
const hasUnsupportedCharacters = require('./hasUnsupportedCharacters');

const extractBudgetData = input => {
  if (!input) return {};

  const results = {
    currency: '',
    // Information in brackets is not taken into account.
    formatted: input.replace(/ *\([^)]*\) */g, '').trim(),
    raw: input,
    value: 0,
  };

  if (hasUnsupportedCharacters(results.formatted)) {
    return results;
  }

  const currenciesPresent = getCurrenciesPresent(results.formatted);

  if (currenciesPresent.normal || currenciesPresent.symbolic) {
    const currencyData = getCurrencyData({
      inputString: results.formatted,
      currenciesPresent,
    });

    results.currency = currencyData.currency;
    results.value = currencyData.value;
  }

  return results;
};

module.exports = extractBudgetData;
