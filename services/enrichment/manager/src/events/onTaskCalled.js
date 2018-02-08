const countries = require('i18n-iso-countries');
const request = require('request-promise-native');

export const handler = async (event, context, callback) => {
  const record = JSON.parse(event.Body);

  let enriched = false;

  if (!record || !record.project_locations) {
    return callback(null, 'nothing to do');
  }

  record.project_locations.forEach(async loc => {
    if (!loc) {
      return null;
    }

    // Country code is provided but location is empty
    if (loc.country_code && !loc.location) {
      console.log('Will infer location from country_code: ', loc.country_code);

      // Get country name from ISO 3166-1 Alpha-2 code (doesn't seem mandatory after some testing...)
      const country = countries.getName(loc.country_code, 'en');

      const url = `http://europa.eu/webtools/rest/gisco/nominatim/search.php?format=json&country=${encodeURIComponent(
        country
      )}`;

      try {
        const results = await request.get({
          url,
          json: true,
          headers: {
            'User-Agent': 'eubfr',
          },
        });

        enriched = true;
        console.log('results', results);
        if (results && results[0]) {
          /*
          lat: '42.6073975',
          lon: '25.4856617',
          */
          console.log('coordinates of ', country, ' are ', [
            results[0].lon,
            results[0].lat,
          ]);
        }
      } catch (e) {
        console.error(e);
      }

      return null;
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
      enriched = true;
      return null;
    }

    return null;
  });

  console.log('enriched?', enriched);
  return null; // callback(null, event);
};

export default handler;
