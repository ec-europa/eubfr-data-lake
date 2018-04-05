import request from 'request-promise-native';

export const enrichLocationNutsFromCentroid = async (loc, precision = 0) => {
  // Use centroid to determine country_code
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

  if (results.results.length) {
    return Object.assign({}, loc, {
      nuts: results.results
        .map(result => ({
          code: result.attributes.NUTS_ID,
          name: result.attributes.NUTS_NAME,
          level: +result.attributes.LEVL_CODE,
          year: result.layerName,
        }))
        .splice(0, precision + 1),
    });
  }

  return loc; // location not enriched
};

export default enrichLocationNutsFromCentroid;