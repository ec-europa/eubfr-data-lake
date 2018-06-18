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

const processBudgetItem = async (inputBudgetItem, projectEnd) => {
  if (!inputBudgetItem) return null;

  let budgetItem = inputBudgetItem;

  // Budget items should always be arrays
  if (!Array.isArray(budgetItem)) {
    budgetItem = [budgetItem];
  }

  // check if it at least one is in EUR
  if (budgetItem.some(item => item.currency === 'EUR')) return budgetItem;

  // Enrich from first element
  const budgetItemToEnrich = budgetItem[0];

  if (
    budgetItemToEnrich.currency &&
    budgetItemToEnrich.currency !== 'EUR' &&
    availableCurrencies.indexOf(budgetItemToEnrich.currency) >= 0
  ) {
    const projectEndDate = new Date(projectEnd);
    const year = projectEndDate.getFullYear();
    const url = `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/A.${
      budgetItemToEnrich.currency
    }.EUR.SP00.A`;
    console.log('will enrich', budgetItemToEnrich, url);

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
      return budgetItem; // budget not enriched
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
      const euroValue =
        Math.ceil(budgetItemToEnrich.value / exr / precision) * precision;

      const formattedEuroBudget = {
        value: euroValue,
        currency: 'EUR',
        raw: `EUR ${euroValue}`,
      };

      // Return enriched record
      return budgetItem.concat(formattedEuroBudget);
    }
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
    // TRY CATCH
    const enrichedBudgetFields = await Promise.all(
      budgetFields.map(async field =>
        processBudgetItem(
          enrichedRecord.budget[field],
          enrichedRecord.timeframe.to
        )
      )
    );

    console.log('Before', enrichedRecord.budget);

    // Enrich here
    enrichedBudgetFields.forEach((field, index) => {
      enrichedRecord.budget[budgetFields[index]] = field;
    });

    console.log('After', enrichedRecord.budget);
  }

  return enrichedRecord;
};

export default enrich;
