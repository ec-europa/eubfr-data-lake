import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import connectionClass from 'http-aws-es';
import elasticsearch from 'elasticsearch';
import isEqual from 'lodash.isequal';

import computeId from '@eubfr/lib/computeId';
import { enrich } from '../lib/enrich';

// Throwing errors within this handler will enqueue issues to EnrichmentFieldsLocationFailuresQueue.
export const handler = async (event, context) => {
  const { REGION, QUEUE_NAME, API, INDEX } = process.env;

  /*
   * Some checks here before going any further
   */
  if (!event.Records) {
    return 'No record';
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return 'Bad record';
  }

  /*
   * Extract information from the event
   */

  // Extract record
  const record = JSON.parse(snsRecord.Sns.Message);

  /**
   * Pre-check if the document needs to be enriched
   */
  if (!record.project_locations || record.project_locations.length === 0) {
    return 'no locations to enrich';
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
    return 'nothing to do';
  }

  /**
   * If the pre-check passes, retrieve the existing record
   */

  // Elasticsearch client instantiation
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.3',
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
    console.error(`Project with ID ${id} was not found in Elasticsearch.`);
    throw e;
  }

  if (!elasticHit || !elasticHit._source) {
    return 'record does not exist, stop enrichment';
  }

  /*
   * Finally, enrich the record.
   */
  try {
    const enrichedRecord = await enrich(elasticHit._source);

    if (!enrichedRecord || isEqual(elasticHit._source, enrichedRecord)) {
      return 'record not enriched';
    }

    // Get Account ID from lambda function arn in the context
    const accountId = context.invokedFunctionArn.split(':')[4];

    const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });
    const queueUrl = `https://sqs.${REGION}.amazonaws.com/${accountId}/${QUEUE_NAME}`;

    await SQS.sendMessage({
      MessageAttributes: {},
      MessageBody: JSON.stringify({
        id,
        data: {
          project_locations: enrichedRecord.project_locations, // only update project_locations
        },
      }),
      QueueUrl: queueUrl,
    }).promise();

    return 'record enriched successfully and sent to queue';
  } catch (e) {
    throw e;
  }
};

export default handler;
