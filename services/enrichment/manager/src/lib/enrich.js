import countries from 'i18n-iso-countries';
import request from 'request-promise-native';
import { mergeRecords } from './merge';

export const enrich = async (record, existingRecord) => {
  const enrichedRecord = mergeRecords(record, existingRecord);

  const newLocations = (await Promise.all(
    enrichedRecord.project_locations.map(async loc => {
      if (!loc) {
        return null;
      }

      // Country code is provided but location is empty
      if (loc.country_code && !loc.location) {
        console.log(
          'Will infer location from country_code: ',
          loc.country_code
        );

        // Get country name from ISO 3166-1 Alpha-2 code (doesn't seem mandatory after some testing...)
        const country = countries.getName(loc.country_code, 'en');

        const url = `http://europa.eu/webtools/rest/gisco/nominatim/search.php?format=json&country=${encodeURIComponent(
          country
        )}`;

        let results;
        try {
          results = await request.get({
            url,
            json: true,
            headers: {
              'User-Agent': 'eubfr',
            },
          });
        } catch (e) {
          console.error(e);
          return loc;
        }

        console.log('results', results);
        if (results && results[0] && results[0].lon && results[0].lat) {
          const { lon, lat } = results[0];

          console.log('coordinates of ', country, ' are ', [lon, lat]);

          const enrichedLocation = JSON.parse(JSON.stringify(loc));

          // Add centroid
          enrichedLocation.centroid = {
            lat: parseFloat(lat) || 0,
            lon: parseFloat(lon) || 0,
          };

          // Add location
          enrichedLocation.location = {
            type: 'Point',
            coordinates: [parseFloat(lon) || 0, parseFloat(lat) || 0],
          };

          return enrichedLocation;
        }

        return loc;
      } else if (
        !loc.country_code &&
        loc.location &&
        loc.location.type === 'Point' &&
        loc.location.coordinates
      ) {
        console.log(
          'Will infer country_code from location',
          loc.location.coordinates
        );
        return loc;
      }

      return loc;
    })
  )).filter(loc => loc);

  // Update locations
  enrichedRecord.project_locations = newLocations;

  console.log('was: ', record.project_locations);
  console.log('now: ', enrichedRecord.project_locations);
  return enrichedRecord;
};

export default enrich;
