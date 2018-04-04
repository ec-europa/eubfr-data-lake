import { mergeRecords } from './merge';
import { precisionHelper } from './precisionHelper';
import { enrichLocationFromAddress } from './enrichLocationFromAddress';
import { enrichLocationFromCentroid } from './enrichLocationFromCentroid';
import { enrichLocationNutsFromCentroid } from './enrichLocationNutsFromCentroid';

export const enrich = async (record, existingRecord) => {
  const enrichedRecord = mergeRecords(record, existingRecord);

  const newLocations = (await Promise.all(
    enrichedRecord.project_locations.map(async loc => {
      if (!loc) {
        return null;
      }

      let location = Object.assign({}, loc);
      let precision = precisionHelper(loc);

      if (!location.centroid) {
        location = await enrichLocationFromAddress(location);
      }

      if (location.centroid) {
        if (!location.country_code) {
          location = await enrichLocationFromCentroid(location);
        }

        if (!location.nuts.length) {
          location = await enrichLocationNutsFromCentroid(location, precision);
        }
      }

      return location;
    })
  )).filter(loc => loc);

  // Update locations
  enrichedRecord.project_locations = newLocations;

  return enrichedRecord;
};

export default enrich;
