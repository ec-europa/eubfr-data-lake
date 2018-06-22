export const mergeRecords = (newRecord, existingRecord) => {
  if (!newRecord) return null;

  const mergedRecord = JSON.parse(JSON.stringify(newRecord));

  if (existingRecord) {
    // extract enriched data if available
  }

  return mergedRecord;
};

export default mergeRecords;
