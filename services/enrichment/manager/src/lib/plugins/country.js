import countries from 'i18n-iso-countries';
import request from 'request-promise-native';

export const enrichFromCountry = async loc => {
  // Get country name from ISO 3166-1 Alpha-2 code (doesn't seem mandatory after some testing...)
  const country = countries.getName(loc.country_code, 'en');

  const qs = {
    format: 'json',
    country,
  };

  // If the town has been provided, use it
  if (loc.town) {
    qs.city = loc.town;
  }

  const url = 'http://europa.eu/webtools/rest/gisco/nominatim/search.php';

  let results;

  try {
    results = await request.get({
      url,
      qs,
      json: true,
      headers: {
        'User-Agent': 'eubfr',
      },
    });
  } catch (e) {
    console.error(url, qs, e);
    return loc; // location not enriched
  }

  if (results && results[0] && results[0].lon && results[0].lat) {
    const { lon, lat } = results[0];

    // Clone existing location
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

  return loc; // location not enriched
};

export default enrichFromCountry;
