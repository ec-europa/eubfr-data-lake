import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import { needsEnrichment, alreadyEnriched } from '../lib/checks';
import { computeId } from '../lib/computeId';
import { enrich } from '../lib/enrich';

export const handler = async (event, context, callback) => {
  const record = JSON.parse(event.Body);

  /**
   * 1. Pre-check if the document needs to be enriched
   */
  if (!needsEnrichment(record)) {
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

  /**
   * 3. Check if the existing record has already been enriched
   */
  const existingRecord = elasticHit._source;

  if (alreadyEnriched(record, existingRecord)) {
    return callback(null, 'the record has already been enriched');
  }

  // 4. Finally, enrich the record
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
