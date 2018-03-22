import { mergeRecords } from './merge';
import { enrichLocationFromAddress } from './enrichLocationFromAddress';
import { enrichLocationFromCentroid } from './enrichLocationFromCentroid';
import { enrichLocationNuts2FromCentroid } from './enrichLocationNuts2FromCentroid';

export const enrich = async (record, existingRecord) => {
  const enrichedRecord = mergeRecords(record, existingRecord);

  const newLocations = (await Promise.all(
    enrichedRecord.project_locations.map(async loc => {
      if (!loc) {
        return null;
      }

      if (!loc.centroid) {
        loc = await enrichLocationFromAddress(loc);
      }

      if (loc.centroid) {
        if (!loc.country_code) {
          loc = await enrichLocationFromCentroid(loc);
        }

        if (!loc.nuts2) {
          loc = await enrichLocationNuts2FromCentroid(loc);
        }
      }

      return loc;
    })
  )).filter(loc => loc);

  // Update locations
  enrichedRecord.project_locations = newLocations;

  return enrichedRecord;
};

export default enrich;
