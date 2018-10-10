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

  // When the following are present, too hard to predict position of useful information with precision.
  const unsupportedList = [':', '/', '-', '+'];

  const unsupported = unsupportedList.find(s => {
    const parts = results.formatted.split(s);
    if (parts.length > 1) return true;
    return false;
  });

  if (unsupported) {
    results.currency = '';
    results.value = 0;
    return results;
  }

  // Currency extraction part.

  // Get information about currencies in normal textual form: EUR, ECU, etc.
  const currenciesList = currencies.join('|');
  const currenciesPattern = new RegExp(currenciesList, 'gi');
  const currenciesMatches = results.formatted.match(currenciesPattern);

  // Checks if formatted text contains a valid currency.
  if (currenciesMatches && currenciesMatches.length) {
    results.currency = currenciesMatches[0].toUpperCase();

    const currencyBetween =
      results.formatted
        .split(results.currency)
        .filter(e => e)
        .filter(s => s !== ' ').length > 1;

    // One in between items or multiple currencies can't be predicted precisely.
    if (currencyBetween || currenciesMatches.length > 1) {
      results.currency = '';
      results.value = 0;
      return results;
    }
  }

  // If textual currencies haven't been found yet, try also symbolic ones.
  const symbolsMap = {
    '€': 'EUR',
    '£': 'GBP',
    '\\$': 'USD',
  };

  const currenciesListSymbolic = Object.keys(symbolsMap).join('|');
  const currenciesPatternSymbolic = new RegExp(currenciesListSymbolic, 'gi');
  const currenciesMatchesSymbolic = results.formatted.match(
    currenciesPatternSymbolic
  );

  if (currenciesMatchesSymbolic && currenciesMatchesSymbolic.length) {
    if (currenciesMatchesSymbolic.length === 1) {
      const symbol = currenciesMatchesSymbolic[0];

      // Dollar needs to be escaped for the regex, but can't be found back from object.
      if (symbol === '$') {
        results.currency = 'USD';
      } else {
        results.currency = symbolsMap[symbol];
      }
    }
    if (currenciesMatchesSymbolic.length > 1) {
      results.currency = '';
      results.value = 0;
      return results;
    }
  }

  // Value extraction part.
  if (
    results.formatted &&
    !results.value &&
    (results.currency && results.currency !== '')
  ) {
    const numbers = new RegExp('([0-9][0-9., ]*)', 'g');
    const numbersMatches = results.formatted.match(numbers);
    if (numbersMatches && numbersMatches.length) {
      results.value = numbersMatches[0].trim();

      // Take into account special abbreviations.
      // Based on http://numeraljs.com/#format
      const abbreviations = {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't',
      };

      const abbr = Object.keys(abbreviations).join('|');
      const abbrPattern = new RegExp(abbr, 'gi');
      const abbrMatches = results.formatted.match(abbrPattern);
      // In case there are several expensive abbreviations at the same time.
      if (abbrMatches && abbrMatches.length > 1) {
        results.currency = '';
        results.value = 0;
        return results;
      }

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

  // If we couldn't find anything useful, put these.
  if (!results.currency && !results.value) {
    results.currency = '';
    results.value = 0;
  }

  return results;
};

module.exports = extractBudgetData;
