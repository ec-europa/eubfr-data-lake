// @flow
import sanitizeBudgetItem from '@eubfr/lib/budgetFormatter';
import supportedCurrencies from '@eubfr/lib/supportedCurrencies';
import type { BudgetItem, TimePrecision } from '@eubfr/types';

import { getEuroValue } from './getEuroValue';

export const processBudgetItem = async (
  inputBudgetItem: BudgetItem,
  projectEnd: string,
  projectEndPrecision: TimePrecision
) => {
  if (!inputBudgetItem) return null;

  // check if it at least one is in EUR
  if (inputBudgetItem.currency === 'EUR') return inputBudgetItem;

  // ensure date is provided, as it's required
  if (!projectEnd) return inputBudgetItem;

  if (
    inputBudgetItem.currency &&
    inputBudgetItem.currency !== 'EUR' &&
    supportedCurrencies.indexOf(inputBudgetItem.currency) >= 0
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
