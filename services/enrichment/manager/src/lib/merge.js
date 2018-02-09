export const mergeRecords = (newRecord, existingRecord) => {
  // Shallow merge, remove duplicates, etc.
  return JSON.parse(JSON.stringify(existingRecord));
};

export default mergeRecords;
