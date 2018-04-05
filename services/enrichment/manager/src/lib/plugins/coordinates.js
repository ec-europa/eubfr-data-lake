import request from 'request-promise-native';

// Now getting only NUTS information, coordinates could be useful for other fields as well, such as address, post code, region, etc.
export const enrichFromCoordinates = async loc => {
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
    // In case the location doesn't have a country code, but the NUTS service has one
    const nuts0 = results.results
      .map(entry => entry.attributes)
      .filter(code => code.LEVL_CODE === '0');

    // If we can extract country code from the NUTS code
    if (nuts0 && nuts0[0] && nuts0[0].NUTS_ID) {
      // And the record's location doesn't have a country code yet
      if (!loc.country_code) {
        // eslint-disable-next-line
        loc.country_code = nuts0[0].NUTS_ID;
      }
    }

    return Object.assign({}, loc, {
      nuts: results.results.map(result => ({
        code: result.attributes.NUTS_ID,
        name: result.attributes.NUTS_NAME,
        level: +result.attributes.LEVL_CODE,
        year: result.layerName,
      })),
    });
  }

  return loc; // location not enriched
};

export default enrichFromCoordinates;
