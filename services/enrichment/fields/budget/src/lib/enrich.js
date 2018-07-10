/**
 * Convert foreign currencies into EUR usign the exchange rate at project end
 * https://webgate.ec.europa.eu/CITnet/jira/browse/EUBFR-184
 */

import { processBudgetItem } from './processBudgetItem';

export const enrich = async record => {
  if (!record) return null;

  const enrichedRecord = JSON.parse(JSON.stringify(record));

  // If project end date or the budget is not provided
  // or if '_original' is already present,
  // then skip enrichment
  if (
    !enrichedRecord.timeframe ||
    !enrichedRecord.timeframe.to ||
    !enrichedRecord.budget ||
    enrichedRecord.budget._original
  ) {
    return enrichedRecord;
  }

  const budgetFields = [
    'eu_contrib',
    'other_contrib',
    'private_fund',
    'public_fund',
    'total_cost',
  ];

  const enrichedBudgetFields = await Promise.all(
    budgetFields.map(async field =>
      processBudgetItem(
        enrichedRecord.budget[field],
        enrichedRecord.timeframe.to,
        enrichedRecord.timeframe.to_precision
      )
    )
  );

  // Enrich here
  enrichedBudgetFields.forEach((field, index) => {
    enrichedRecord.budget[budgetFields[index]] = field;
  });

  return enrichedRecord;
};

export default enrich;
