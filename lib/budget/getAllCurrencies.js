const supportedCurrencies = require('./supportedCurrencies');

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

const getAllCurrencies = () => currencies;

module.exports = getAllCurrencies;
