import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import { computeId } from '../lib/computeId';
import { enrich } from '../lib/enrich';

export const handler = async (event, context, callback) => {
  const record = JSON.parse(event.Body);

  /**
   * 1. Pre-check if the document needs to be enriched
   */
  if (!record.project_locations || record.project_locations.length === 0) {
    return callback(null, 'no locations to enrich');
  }

  const numLocations = record.project_locations.length;
  const numLocationsEnriched = record.project_locations.filter(
    loc => loc.enriched
  ).length;

  if (
    numLocations &&
    numLocationsEnriched &&
    numLocations === numLocationsEnriched
  ) {
    return callback(null, 'nothing to do');
  }

  /**
   * 2. If the pre-check passes, retrieve the existing record
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

  const existingRecord = elasticHit._source;

  /*
   * 3. Finally, enrich the record
   */
  const enrichedRecord = await enrich(record, existingRecord);

  try {
    await client.index({
      index: INDEX,
      type: 'project',
      id,
      body: Object.assign({}, enrichedRecord, {
        last_modified: new Date().toISOString(), // ISO-8601 date
      }),
    });
  } catch (e) {
    return callback(e);
  }

  return callback(null, 'record enriched successfully');
};

export default handler;
