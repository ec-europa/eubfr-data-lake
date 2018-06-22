/* eslint-disable no-underscore-dangle */
export const mergeRecords = (newRecord, existingRecord) => {
  if (!newRecord) return null;

  const mergedRecord = JSON.parse(JSON.stringify(newRecord));

  // What we need to retrieve from the existing record
  mergedRecord.computed_key = existingRecord.computed_key;

  // Budget: copy existing record if already enriched
  const budgetFields = [
    'eu_contrib',
    'other_contrib',
    'private_fund',
    'public_fund',
    'total_cost',
  ];

  if (existingRecord.budget && newRecord.budget) {
    budgetFields.forEach(field => {
      if (
        existingRecord.budget[field] &&
        mergedRecord.budget[field] &&
        existingRecord.budget[field]._original &&
        existingRecord.budget[field]._original.currency ===
          mergedRecord.budget[field].currency &&
        existingRecord.budget[field]._original.value ===
          mergedRecord.budget[field].value
      ) {
        mergedRecord.budget[field] = JSON.parse(
          JSON.stringify(existingRecord.budget[field])
        );
      }
    });
  }

  return mergedRecord;
};

export default mergeRecords;
