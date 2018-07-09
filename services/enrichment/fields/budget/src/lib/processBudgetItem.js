// @flow
import request from 'request-promise-native';
import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import type { BudgetItem } from '@eubfr/types';

const precision = 100; // round converted value to the nearest 100

// List of currencies that can be translated into EUR
// Manually extracted form ECB's API
// http://sdw.ecb.europa.eu/browseTable.do?node=1495 ("Currency" field)
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

const padDate = (date: number): number | string =>
  date < 10 ? `0${date}` : date;

export const processBudgetItem = async (
  inputBudgetItem: BudgetItem,
  projectEnd: string,
  projectEndPrecision: string
) => {
  if (!inputBudgetItem) return null;

  // check if it at least one is in EUR
  if (inputBudgetItem.currency === 'EUR') return inputBudgetItem;

  // ensure date is provided, as it's required
  if (!projectEnd) return inputBudgetItem;

  if (
    inputBudgetItem.currency &&
    inputBudgetItem.currency !== 'EUR' &&
    availableCurrencies.indexOf(inputBudgetItem.currency) >= 0
  ) {
    const projectEndDate = new Date(projectEnd);

    // Least precision: year
    let period = projectEndDate.getFullYear();
    let apiPeriod = 'A';

    // Best precision: day
    if (projectEndPrecision === 'day') {
      const month = projectEndDate.getMonth() + 1;
      const day = projectEndDate.getDate();
      period = `${period}-${padDate(month)}-${padDate(day)}`;
      apiPeriod = 'D';
    }

    // If not a day, try at least: month
    if (projectEndPrecision === 'month') {
      const month = projectEndDate.getMonth() + 1;
      period = `${period}-${padDate(month)}`;
      apiPeriod = 'M';
    }

    // "EXR/A.[currency].EUR.SP00.A" corresponds to the key of a dataset
    // The keys can be found here: http://sdw.ecb.europa.eu/browseTable.do?node=1495
    // API info: https://sdw-wsrest.ecb.europa.eu/web/generator/index.html
    const url = `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/${apiPeriod}.${
      inputBudgetItem.currency
    }.EUR.SP00.A`;

    let results;
    const qs = {
      startPeriod: period,
      endPeriod: period,
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
      console.error('error', url, qs, e);
      return inputBudgetItem; // budget not enriched
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
        Math.ceil(inputBudgetItem.value / exr / precision) * precision;

      const formattedEuroBudget = sanitizeBudgetItem({
        value: euroValue,
        currency: 'EUR',
        raw: `EUR ${euroValue}`,
        _original: {
          value: inputBudgetItem.value,
          currency: inputBudgetItem.currency,
          raw: inputBudgetItem.raw,
        },
      });

      // Return enriched record
      return formattedEuroBudget;
    }
  }

  return inputBudgetItem;
};

export default processBudgetItem;
