const supportedCurrencies = require('./supportedCurrencies');

const extractBudgetData = input => {
  // Extend the list of ECB's API's supported currencies.
  // Most of these are possble to convert based on fixed exchange rates.
  const additionalCurrencies = [
    'ATS',
    'CYP',
    'DEM',
    'DM',
    'BEF',
    'ECU',
    'EEK',
    'ESP',
    'EUR',
    'FF',
    'FIM',
    'FRF',
    'GRD',
    'IEP',
    'ITL',
    'LVL',
    'LTL',
    'LUF',
    'MTL',
    'NLG',
    'PTE',
    'SEK',
    'SIT',
    'SKK',
  ];

  const currencies = [...supportedCurrencies, ...additionalCurrencies];

  const results = {};

  if (!input) return results;

  results.raw = input;

  // Information in brackets is not necessary.
  const formatted = input.replace(/ *\([^)]*\) */g, '').trim();

  results.formatted = formatted;

  // Also information before columns.
  if (formatted.includes(':')) {
    const parts = formatted.split(':');
    // eslint-disable-next-line prefer-destructuring
    results.formatted = parts[1];
  }

  // Also information before forward slashes.
  if (formatted.includes('/')) {
    const parts = formatted.split('/');
    // eslint-disable-next-line prefer-destructuring
    results.formatted = parts[1];
  }

  // Checks if formatted text contains a valid currency.
  currencies.forEach(currency => {
    const regex = new RegExp(currency, 'gi');
    const matches = formatted.match(regex);
    // If a given currency is found.
    if (matches && matches.length) {
      // Make a bold assumption
      results.currency = currency;
      // If multiple currencies or a minus, we can't know what is right.
      if (matches.length > 1) {
        delete results.currency;
      }
    }
  });

  // Handle symbolic currncies.
  const symbolsMap = {
    '€': 'EUR',
    '£': 'GBP',
    '\\$': 'USD',
  };

  Object.keys(symbolsMap).forEach(symbol => {
    const sign = new RegExp(symbol, 'gi');
    const matches = formatted.match(sign);
    if (matches && matches.length) {
      results.currency = symbolsMap[symbol];
    }
  });

  if (results.formatted && results.currency) {
    const numbers = new RegExp('([0-9][0-9., ]*)', 'g');
    const matches = results.formatted.match(numbers);
    if (matches && matches.length) {
      results.value = matches[0].trim();

      // Take into account millions.
      if (results.formatted.includes('million')) {
        if (results.value.includes(',')) {
          results.value = results.value.replace(/,/g, '.');
        }
        // And format value for numeral.
        results.value = `${results.value} m`;
      }
    }
  }

  return results;
};

module.exports = extractBudgetData;
