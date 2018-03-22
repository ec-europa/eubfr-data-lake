import request from 'request-promise-native';

export const enrichLocationFromCentroid = async loc => {
  // Use centroid to determine country_code
  const { lat, lon } = loc.centroid;

  if (!lat || !lon) return loc; // location not enriched

  const qs = {
    format: 'json',
    lat,
    lon,
  };

  const url = 'https://europa.eu/webtools/rest/gisco/nominatim/reverse.php';

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

  if (results && results.address && results.address.country_code) {
    // Clone existing location
    const enrichedLocation = JSON.parse(JSON.stringify(loc));

    // Add country_code
    enrichedLocation.country_code = (
      results.address.country_code || ''
    ).toUpperCase();

    return enrichedLocation;
  }

  return Promise.resolve(loc); // location not enriched
};

export default enrichLocationFromCentroid;
