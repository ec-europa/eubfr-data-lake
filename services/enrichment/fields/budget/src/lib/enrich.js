/**
 * Convert foreign currencies into EUR usign the exchange rate at project end
 * https://webgate.ec.europa.eu/CITnet/jira/browse/EUBFR-184
 */

import { processBudgetItem } from './processBudgetItem';

export const enrich = async record => {
  if (!record) return null;

  const enrichedRecord = JSON.parse(JSON.stringify(record));

  // If project end date is not provided, skip enrichment
  if (!enrichedRecord.timeframe || !enrichedRecord.timeframe.to) {
    return enrichedRecord;
  }

  const budgetFields = [
    'eu_contrib',
    'other_contrib',
    'private_fund',
    'public_fund',
    'total_cost',
  ];

  if (enrichedRecord.budget) {
    const enrichedBudgetFields = await Promise.all(
      budgetFields.map(async field =>
        processBudgetItem(
          enrichedRecord.budget[field],
          enrichedRecord.timeframe.to
        )
      )
    );

    // Enrich here
    enrichedBudgetFields.forEach((field, index) => {
      enrichedRecord.budget[budgetFields[index]] = field;
    });
  }

  return enrichedRecord;
};

export default enrich;
