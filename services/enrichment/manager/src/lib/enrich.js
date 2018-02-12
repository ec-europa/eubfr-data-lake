import { mergeRecords } from './merge';
import { enrichLocationFromAddress } from './enrichLocationFromAddress';
import { enrichLocationFromCentroid } from './enrichLocationFromCentroid';

export const enrich = async (record, existingRecord) => {
  const enrichedRecord = mergeRecords(record, existingRecord);

  const newLocations = (await Promise.all(
    enrichedRecord.project_locations.map(async loc => {
      if (!loc) {
        return null;
      }

      if (!loc.centroid && loc.country_code) {
        // Centroid is empty but country code is provided
        return enrichLocationFromAddress(loc);
      } else if (!loc.country_code && loc.centroid) {
        // Country code is empty but centroid is provided
        return enrichLocationFromCentroid(loc);
      }

      return loc;
    })
  )).filter(loc => loc);

  // Update locations
  enrichedRecord.project_locations = newLocations;

  return enrichedRecord;
};

export default enrich;
