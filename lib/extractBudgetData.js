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

  /**
   * Currency extraction part.
   */

  // Get information about currencies in normal textual form: EUR, ECU, etc.
  const currenciesList = currencies.join('|');
  const currenciesPattern = new RegExp(`\\b(${currenciesList})\\b`, 'gi');
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

  const currenciesSymbolic = Object.keys(symbolsMap).join('|');
  const currenciesSymPatt = new RegExp(currenciesSymbolic, 'gi');
  const currenciesMatchesSymbolic = results.formatted.match(currenciesSymPatt);

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

    // If several symbolic currencies are present at the same time, ignore it.
    if (currenciesMatchesSymbolic.length > 1) {
      results.currency = '';
      results.value = 0;
      return results;
    }
  }

  // Check for cases where there are both textual and symbolic currencies.
  const currenciesCombined = `${currenciesList}|${currenciesSymbolic}`;
  const currenciesCombPatt = new RegExp(currenciesCombined, 'gi');
  const currenciesCombinedMatch = results.formatted.match(currenciesCombPatt);

  // If there are both textual and symbolic currencies at the same time, ignore it.
  if (currenciesCombinedMatch && currenciesCombinedMatch.length > 1) {
    results.currency = '';
    results.value = 0;
    return results;
  }

  /**
   * Value extraction part.
   */

  if (results.currency) {
    // If valid currency has been found so far, extract value as well.
    const numbers = new RegExp('([0-9][0-9., ]*)', 'g');
    const numbersMatches = results.formatted.match(numbers);
    if (numbersMatches && numbersMatches.length) {
      const number = numbersMatches[0];
      const hasSpacesBetweenNumbers = number.match(/(?<=\d)\s(?=\d)/gi);

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
      const hasAbbreviations = abbrMatches && abbrMatches.length;
      const hasMultipleAbbreviations = abbrMatches && abbrMatches.length > 1;

      if (
        hasMultipleAbbreviations ||
        (hasAbbreviations && hasSpacesBetweenNumbers)
      ) {
        results.currency = '';
        results.value = 0;
        return results;
      }

      results.value = number.trim();

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
