import { mergeRecords } from './merge';
// import { enrichCurrency } from '../plugins/currency';

const availableCurrencies = [
  'AUD',
  'BGN',
  'BRL',
  'CAD',
  'CHF',
  'CNY',
  'CYP',
  'CZK',
  'DKK',
  'DZD',
  'EEK',
  'EGP',
  'GBP',
  'GRD',
  'HKD',
  'HRK',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'ISK',
  'JPY',
  'KRW',
  'LTL',
  'LVL',
  'MAD',
  'MTL',
  'MXN',
  'MYR',
  'NOK',
  'NZD',
  'PHP',
  'PLN',
  'RON',
  'RUB',
  'SEK',
  'SGD',
  'SIT',
  'SKK',
  'THB',
  'TRY',
  'TWD',
  'USD',
  'ZAR',
];
// https://sdw-wsrest.ecb.europa.eu/service/data/EXR/M.USD.EUR.SP00.A?startPeriod=2014-12&endPeriod=2014-12&detail=dataonly

const processBudgetItem = budgetItem => {
  if (!budgetItem) return null;

  if (
    budgetItem.currency &&
    budgetItem.currency !== 'EUR' &&
    availableCurrencies.indexOf(budgetItem.currency) >= 0
  ) {
    console.log('will enrich', budgetItem);
    return true;
  }

  return false;
};

export const enrich = async (record, existingRecord) => {
  const enrichedRecord = mergeRecords(record, existingRecord);

  // If project end date is not provided, skip enrichment
  if (
    !enrichedRecord ||
    !enrichedRecord.timeframe ||
    !enrichedRecord.timeframe.to
  ) {
    return null;
  }

  const budgetFields = [
    'eu_contrib',
    'other_contrib',
    'private_fund',
    'public_fund',
    'total_cost',
  ];

  if (enrichedRecord.budget) {
    // DO THE WORK
    budgetFields.forEach(field => {
      // data is either an object or an array
      // currency
      // raw
      // value
      const data = enrichedRecord.budget[field];

      if (Array.isArray(data)) {
        // do something
        data.forEach(processBudgetItem);
      } else {
        processBudgetItem(data);
      }
    });
  }

  return enrichedRecord;
};

export default enrich;
