export const mergeRecords = (newRecord, existingRecord) => {
  const mergedRecord = JSON.parse(JSON.stringify(newRecord));

  // What we need to retrieve from the existing record
  mergedRecord.computed_key = existingRecord.computed_key;
  mergedRecord.created_by = existingRecord.created_by;
  mergedRecord.last_modified = existingRecord.last_modified; // Note: it should be overridden later

  return mergedRecord;
};

export default mergeRecords;
