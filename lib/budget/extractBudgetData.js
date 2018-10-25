const getValue = require('./getValue');
const getCurrency = require('./getCurrency');
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

  const currencyData = getCurrencyData(results.formatted);

  // If any type of currency is present.
  if (currencyData.normal || currencyData.symbolic) {
    const currency = getCurrency(currencyData);
    const value = getValue(results.formatted);

    // If there is currency, but it's between values, we can't figure it.
    if (currency) {
      const betweenCurrency = results.formatted.split(currency).filter(c => c);

      if (betweenCurrency && betweenCurrency.length > 1) {
        return results;
      }
    }

    if (currency !== '' && value !== 0) {
      results.currency = currency;
      results.value = value;
    }
  }

  return results;
};

module.exports = extractBudgetData;
