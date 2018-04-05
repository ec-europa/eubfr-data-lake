import { mergeRecords } from './merge';
import { enrichFromCoordinates } from './plugins/coordinates';
import { enrichFromCountry } from './plugins/country';

export const enrich = async (record, existingRecord) => {
  const enrichedRecord = mergeRecords(record, existingRecord);

  const newLocations = (await Promise.all(
    enrichedRecord.project_locations.map(async loc => {
      // No information to work with, just exit
      if (!loc) {
        return null;
      }

      let location = Object.assign({}, loc);

      // Best scenario: we have coordinates
      if (loc.centroid) {
        // get nuts information from coordinates
        location = await enrichFromCoordinates(location);
      } else if (loc.address) {
        // get coordinates from address
        // if data added, call previous enrichFromCoordinates plugin here as well
      }

      // Less precision
      if (loc.nuts.length) {
        // get country code if not available yet
        // separate or only in previous step?
      }

      if (loc.country_code) {
        location = await enrichFromCountry(location);
      }

      return location;
    })
  )).filter(loc => loc);

  // Update locations
  enrichedRecord.project_locations = newLocations;

  return enrichedRecord;
};

export default enrich;
