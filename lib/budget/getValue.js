/**
 * Get useful numeric value out of a given inputString.
 * @param  {String} inputString String from which to extract numeric data.
 * @return {Number|String}     Actual numeric value
 */
const getValue = inputString => {
  const numbers = new RegExp('([0-9][0-9., ]*)', 'g');
  const numbersMatches = inputString.match(numbers);

  if (numbersMatches && numbersMatches.length) {
    let value = numbersMatches[0].trim();
    const hasSpacesBetweenNumbers = value.match(/(?<=\d)\s(?=\d)/gi);

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
    const abbrMatches = inputString.match(abbrPattern);
    const hasAbbreviations = abbrMatches && abbrMatches.length;
    const hasMultipleAbbreviations = abbrMatches && abbrMatches.length > 1;

    if (
      hasMultipleAbbreviations ||
      (hasAbbreviations && hasSpacesBetweenNumbers)
    ) {
      return 0;
    }

    Object.keys(abbreviations).forEach(abbreviation => {
      if (inputString.includes(abbreviation)) {
        if (value.includes(',')) {
          value = value.replace(/,/g, '.');
        }
        // And format value for numeral.
        value = `${value} ${abbreviations[abbreviation]}`;
      }
    });

    return value;
  }

  return 0;
};

module.exports = getValue;
