import request from 'request-promise-native';

export const enrichLocationFromCentroid = async loc => {
  console.log(
    'Will infer country_code from centroid',
    loc.location.coordinates
  );

  // Use centroid to determine country_code
  const { lat, lon } = loc.centroid;
  const url = `https://europa.eu/webtools/rest/gisco/nominatim/reverse.php?format=json&lon=${lon}&lat=${lat}`;

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
    return loc; // location not enriched
  }

  if (results && results.address && results.address.country_code) {
    // Clone existing location
    const enrichedLocation = JSON.parse(JSON.stringify(loc));

    // Add country_code
    enrichedLocation.country_code = results.address.country_code;

    return enrichedLocation;
  }

  return loc; // location not enriched
};

export default enrichLocationFromCentroid;
