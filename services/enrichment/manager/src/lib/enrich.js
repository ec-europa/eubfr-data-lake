import { mergeRecords } from './merge';
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

      /*
      country code = NUTS0 (= country code)
      region = NUTS 2 or 1
      postal code = NUTS 3 or 2
      lat/lon = NUTS3
      */

      let location = Object.assign({}, loc);
      if (!location.centroid) {
        location = await enrichLocationFromAddress(location);
      }

      if (location.centroid) {
        if (!location.country_code) {
          location = await enrichLocationFromCentroid(location);
        }

        if (!location.nuts.length) {
          location = await enrichLocationNutsFromCentroid(location);
        }
      }

      debugger;

      return location;
    })
  )).filter(loc => loc);

  // Update locations
  enrichedRecord.project_locations = newLocations;

  return enrichedRecord;
};

export default enrich;
