const supportedCurrencies = require('./supportedCurrencies');

const extractBudgetData = input => {
  // Extend the list of ECB's API's supported currencies.
  const additionalCurrencies = ['EUR', 'ECU', 'DM', 'FF', 'FIM', 'SEK', 'ESP'];
  const currencies = [...supportedCurrencies, ...additionalCurrencies];

  const results = {};

  if (!input) return results;

  results.raw = input;

  // Information in brackets is not necessary.
  let formatted = input.replace(/ *\([^)]*\) */g, '').trim();

  // Also information after columns.
  if (formatted.includes(':')) {
    const parts = formatted.split(':');
    // eslint-disable-next-line prefer-destructuring
    formatted = parts[1];
  }

  results.formatted = formatted;

  // Checks if formatted text contains a valid currency.
  currencies.forEach(currency => {
    const regex = new RegExp(currency, 'gi');
    const matches = formatted.match(regex);
    if (matches && matches.length) {
      results.currency = currency;
    }
  });

  if (results.formatted && results.currency) {
    const numbers = new RegExp('([0-9][0-9., ]*)', 'g');
    const matches = results.formatted.match(numbers);
    if (matches && matches.length) {
      results.value = matches[0].trim();
      // Take into account millions keywords.
      if (results.formatted.includes('million')) {
        // And format value for numeral.
        results.value = `${results.value} m`;
      }
    }
  }

  return results;
};

module.exports = extractBudgetData;
