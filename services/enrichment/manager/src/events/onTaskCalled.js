import countries from 'i18n-iso-countries';
import request from 'request-promise-native';
import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import { needsEnrichment, alreadyEnriched } from '../lib/checks';
import { computeId } from '../lib/computeId';

export const handler = async (event, context, callback) => {
  const record = JSON.parse(event.Body);

  /**
   * 1. Pre-check if the document needs to be enriched
   */
  if (!needsEnrichment(record)) {
    return callback(null, 'nothing to do');
  }

  /**
   * 2. If the pre-check passes, retrieves the existing record
   */
  const { API, INDEX } = process.env;

  // Elasticsearch client instantiation
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.0',
    connectionClass,
    index: INDEX,
  });

  // Compute ID
  const id = computeId({
    computedKey: record.computed_key,
    projectId: record.project_id,
  });

  let elasticHit = null;

  try {
    elasticHit = await client.get({
      index: INDEX,
      type: 'project',
      id,
    });
  } catch (e) {
    return callback(e);
  }

  if (!elasticHit || !elasticHit._source) {
    return callback(null, 'record does not exist, stop enrichment');
  }

  /**
   * 3. Check if the existing record has already been enriched
   */
  const existingRecord = elasticHit._source;

  if (alreadyEnriched(record, existingRecord)) {
    return callback(null, 'the record has already been enriched');
  }

  // 4. Finally, enrich the record
  let enriched = false;

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
