import request from 'request-promise-native';

// Throwing errors in this helper will queue issue a dead letter queue.
export const enrichFromCountry = async loc => {
  const country = loc.country_code;

  const qs = {
    format: 'json',
    country,
  };

  // If the town has been provided, use it
  if (loc.town) {
    qs.city = loc.town;
  }

  const url =
    process.env.SERVICE_COUNTRY_ENRICHMENT ||
    'http://europa.eu/webtools/rest/gisco/nominatim/search.php';

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
    throw e;
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

    // Mark as enriched, as coordinates are going to give any more precise info.
    enrichedLocation.enriched = true;

    return enrichedLocation;
  }

  return loc; // location not enriched
};

export default enrichFromCountry;
