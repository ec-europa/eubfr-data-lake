import request from 'request-promise-native';
import { mergeRecords } from './merge';

const precision = 100; // round convert value to the nearest 100
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

const processBudgetItem = async (budgetItem, projectEnd) => {
  if (!budgetItem) return null;

  if (
    budgetItem.currency &&
    budgetItem.currency !== 'EUR' &&
    availableCurrencies.indexOf(budgetItem.currency) >= 0
  ) {
    const projectEndDate = new Date(projectEnd);
    const year = projectEndDate.getFullYear();
    const url = `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/A.${
      budgetItem.currency
    }.EUR.SP00.A`;
    console.log('will enrich', budgetItem, url);

    let results;
    const qs = {
      startPeriod: year,
      endPeriod: year,
      detail: 'dataonly',
    };

    try {
      results = await request.get({
        url,
        qs,
        json: true,
        headers: {
          Accept: 'application/vnd.sdmx.data+json;version=1.0.0-wd',
        },
      });
    } catch (e) {
      console.error(url, qs, e);
      return budgetItem; // location not enriched
    }

    if (
      results &&
      results.dataSets &&
      results.dataSets[0] &&
      results.dataSets[0].series &&
      results.dataSets[0].series['0:0:0:0:0'] &&
      results.dataSets[0].series['0:0:0:0:0'].observations &&
      results.dataSets[0].series['0:0:0:0:0'].observations[0]
    ) {
      const exr = results.dataSets[0].series['0:0:0:0:0'].observations['0'][0];
      console.log('exchange rate', exr);
      console.log(
        'conversion (',
        year,
        '):',
        budgetItem.value,
        ' USD = ',
        Math.ceil(budgetItem.value / exr / precision) * precision,
        'EUR'
      );
    }

    return budgetItem; // return enriched record
  }

  return budgetItem;
};

export const enrich = async (record, existingRecord) => {
  const enrichedRecord = mergeRecords(record, existingRecord);

  // If project end date is not provided, skip enrichment
  if (
    !enrichedRecord ||
    !enrichedRecord.timeframe ||
    !enrichedRecord.timeframe.to
  ) {
    console.log('no timeframe, skipping', enrichedRecord);
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
    budgetFields.forEach(async field => {
      // data is either an object or an array
      const data = enrichedRecord.budget[field];
      let budgetItemToEnrich = data;

      if (Array.isArray(data)) {
        // check if it at least one is in EUR
        if (!data.some(budgetItem => budgetItem.currency === 'EUR')) {
          // Enrich from first element
          [budgetItemToEnrich] = data;
        }
      }

      // Enrich
      enrichedRecord.budget[field] = await processBudgetItem(
        budgetItemToEnrich,
        enrichedRecord.timeframe.to
      );
    });
  }

  return enrichedRecord;
};

export default enrich;
