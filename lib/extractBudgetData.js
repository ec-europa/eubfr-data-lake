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
  results.formatted = input.replace(/ *\([^)]*\) */g, '').trim();

  // Also information before columns.
  if (results.formatted.includes(':')) {
    const parts = results.formatted.split(':');
    // eslint-disable-next-line prefer-destructuring
    results.formatted = parts[1];
  }

  // Also information before forward slashes.
  if (results.formatted.includes('/')) {
    const parts = results.formatted.split('/');
    // eslint-disable-next-line prefer-destructuring
    results.formatted = parts[1];
  }

  // Handle symbolic currencies.
  const symbolsMap = {
    '€': 'EUR',
    '£': 'GBP',
    '\\$': 'USD',
  };

  Object.keys(symbolsMap).forEach(symbol => {
    const sign = new RegExp(symbol, 'gi');
    const matches = results.formatted.match(sign);
    if (matches && matches.length) {
      results.currency = symbolsMap[symbol];
    }
  });

  // Checks if formatted text contains a valid currency.
  currencies.forEach(currency => {
    const m = new RegExp(currency, 'gi');
    const matches = results.formatted.match(m);
    // If a given currency is found.
    if (matches && matches.length) {
      // Make a bold assumption
      results.currency = currency;

      // There are a few cases where we can't know what is correct, so we don't save anything:
      const multipleCurrencies = matches.length > 1;
      const currencyBetween =
        results.formatted
          .split(currency)
          .filter(e => e)
          .filter(s => s !== ' ').length > 1;

      if (multipleCurrencies || currencyBetween) {
        results.currency = '';
        results.value = 0;
      }
    }
  });

  if (
    results.formatted &&
    !results.value &&
    (results.currency && results.currency !== '')
  ) {
    const numbers = new RegExp('([0-9][0-9., ]*)', 'g');
    const matches = results.formatted.match(numbers);
    if (matches && matches.length) {
      results.value = matches[0].trim();

      // Take into account special abbreviations.
      // Based on http://numeraljs.com/#format
      const abbreviations = {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't',
      };

      Object.keys(abbreviations).forEach(abbreviation => {
        if (results.formatted.includes(abbreviation)) {
          if (results.value.includes(',')) {
            results.value = results.value.replace(/,/g, '.');
          }
          // And format value for numeral.
          results.value = `${results.value} ${abbreviations[abbreviation]}`;
        }
      });
    }
  }

  return results;
};

module.exports = extractBudgetData;
