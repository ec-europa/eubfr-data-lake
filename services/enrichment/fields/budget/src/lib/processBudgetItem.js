// @flow
import request from 'request-promise-native';
import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import type { BudgetItem } from '@eubfr/types';

const precision = 100; // round converted value to the nearest 100

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

export const processBudgetItem = async (
  inputBudgetItem: BudgetItem,
  projectEnd: string
) => {
  if (!inputBudgetItem) return null;

  // check if it at least one is in EUR
  if (inputBudgetItem.currency === 'EUR') return inputBudgetItem;

  if (
    inputBudgetItem.currency &&
    inputBudgetItem.currency !== 'EUR' &&
    availableCurrencies.indexOf(inputBudgetItem.currency) >= 0
  ) {
    const projectEndDate = new Date(projectEnd);
    const year = projectEndDate.getFullYear();

    // "EXR/A.[currency].EUR.SP00.A" corresponds to the key of a dataset
    // The keys can be found here: http://sdw.ecb.europa.eu/browseTable.do?node=1495
    // API info: https://sdw-wsrest.ecb.europa.eu/web/generator/index.html
    const url = `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/A.${
      inputBudgetItem.currency
    }.EUR.SP00.A`;

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
