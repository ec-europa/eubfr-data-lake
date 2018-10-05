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
  let formatted = input.replace(/ *\([^)]*\) */g, '').trim();

  // Also information before columns.
  if (formatted.includes(':')) {
    const parts = formatted.split(':');
    // eslint-disable-next-line prefer-destructuring
    formatted = parts[1];
  }

  // Also information before forward slashes.
  if (formatted.includes('/')) {
    const parts = formatted.split('/');
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
    // Handle pound signs
    const poundSign = new RegExp('€', 'gi');
    const pounds = formatted.match(poundSign);
    if (pounds && pounds.length) {
      results.currency = 'GBP';
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
