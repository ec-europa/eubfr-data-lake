// @flow
import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import type { BudgetItem } from '@eubfr/types';

import { getEuroValue } from './getEuroValue';

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

    const euroValue = await getEuroValue(
      inputBudgetItem,
      projectEndDate,
      projectEndPrecision
    );

    if (euroValue) {
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
