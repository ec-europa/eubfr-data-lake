import request from 'request-promise-native';

export const getCountryCode = async loc => {
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

  return loc; // location not enriched
};

// Now getting only NUTS information, coordinates could be useful for other fields as well, such as address, post code, region, etc.
export const enrichFromCentroid = async loc => {
  const { lat, lon } = loc.centroid;

  if (!lat || !lon) return loc; // location not enriched

  const qs = {
    format: 'json',
    lat,
    lon,
  };

  const url = `http://europa.eu/webtools/rest/gisco/nuts/find-nuts.py?x=${lon}&y=${lat}`;

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

  if (results.results && results.results.length) {
    let enrichedLocation = JSON.parse(JSON.stringify(loc));

    const nutsData = results.results.map(result => ({
      code: result.attributes.NUTS_ID,
      name: result.attributes.NUTS_NAME,
      level: +result.attributes.LEVL_CODE,
      year: result.layerName,
    }));

    enrichedLocation.nuts.push(nutsData);

    // Get the country code
    if (!enrichedLocation.country_code) {
      const nuts0 = nutsData.filter(c => c.level === 0);

      // NUTS_ID of item with NUTS level 0 is the country code
      // If we can extract country code from the NUTS code
      if (nuts0 && nuts0[0] && nuts0[0].code) {
        enrichedLocation.country_code = nuts0[0].code;
      } else {
        // Get country code from a service
        enrichedLocation = await getCountryCode(enrichedLocation);
      }
    }

    return enrichedLocation;
  }

  return loc; // location not enriched
};

export default enrichFromCentroid;
