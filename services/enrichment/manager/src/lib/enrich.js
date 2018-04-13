import { mergeRecords } from './merge';
import { enrichFromCentroid } from '../plugins/centroid';
import { enrichFromCountry } from '../plugins/country';

export const enrich = async (record, existingRecord) => {
  if (!record.project_locations || record.project_locations.length === 0) {
    return record;
  }

  const enrichedRecord = mergeRecords(record, existingRecord);

  const newLocations = await Promise.all(
    enrichedRecord.project_locations.filter(loc => loc).map(async loc => {
      let location = JSON.parse(JSON.stringify(loc));

      if (loc.centroid) {
        location = await enrichFromCentroid(location);
      }

      if (loc.country_code) {
        location = await enrichFromCountry(location);
      }

      return location;
    })
  );

  // Update locations
  enrichedRecord.project_locations = newLocations;

  return enrichedRecord;
};

export default enrich;
