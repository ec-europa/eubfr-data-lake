export const mergeRecords = (newRecord, existingRecord) => {
  // Shallow merge, remove duplicates, etc.
  const mergedRecord = JSON.parse(JSON.stringify(newRecord));

  // What we need to retrieve from the existing record
  mergedRecord.computed_key = existingRecord.computed_key;
  mergedRecord.created_by = existingRecord.created_by;
  mergedRecord.last_modified = existingRecord.last_modified; // Note: it will be overridden later

  // Check if some locations have already been enriched
  const mergedLocations = mergedRecord.project_locations
    .map(loc => {
      // Look for loc in existingRecord
      if (loc && existingRecord.project_locations) {
        const finalLoc = loc;
        existingRecord.project_locations.forEach(existingLoc => {
          // If current loc has country_code but no coordinates, but the corresponding existingLoc has coordinates...
          console.log('does match?', loc, existingLoc);
        });

        return finalLoc;
      }

      return loc;
    })
    .filter(loc => loc);

  mergedRecord.project_locations = mergedLocations;

  return mergedRecord;
};

export default mergeRecords;
