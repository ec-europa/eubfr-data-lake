import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import connectionClass from 'http-aws-es';
import elasticsearch from 'elasticsearch';
import isEqual from 'lodash.isequal';
import request from 'request-promise-native';

import computeId from '@eubfr/lib/computeId';
import { enrich } from '../lib/enrich';

export const handler = async (event, context, callback) => {
  const { REGION, QUEUE_NAME, API, INDEX, SERVICE_ENDPOINT } = process.env;

  /*
   * Some checks here before going any further
   */
  if (!event.Records) {
    return callback('No record');
  }

  // Only work on the first record
  const snsRecord = event.Records[0];

  // Was the lambda triggered correctly? Is the file extension supported? etc.
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return callback('Bad record');
  }

  /*
   * Extract information from the event
   */

  // Extract record
  const record = JSON.parse(snsRecord.Sns.Message);

  // Elasticsearch client instantiation
  const client = elasticsearch.Client({
    host: `https://${API}`,
    apiVersion: '6.2',
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
   * Verify whether enrichment service is available at the moment.
   */
  try {
    await request.get({ url: SERVICE_ENDPOINT });
  } catch (e) {
    // This will queue the problem to EnrichmentFieldsBudgetFailuresQueue.
    return callback(e);
  }

  /*
   * Finally, enrich the record
   */
  const enrichedRecord = await enrich(elasticHit._source);

  if (!enrichedRecord || isEqual(elasticHit._source, enrichedRecord)) {
    return callback(null, 'record not enriched');
  }

  // SEND TO SQS QUEUE
  try {
    // Get Account ID from lambda function arn in the context
    const accountId = context.invokedFunctionArn.split(':')[4];

    const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });
    const queueUrl = `https://sqs.${REGION}.amazonaws.com/${accountId}/${QUEUE_NAME}`;

    await SQS.sendMessage({
      MessageAttributes: {},
      MessageBody: JSON.stringify({
        id,
        data: {
          budget: enrichedRecord.budget, // only update budget
        },
      }),
      QueueUrl: queueUrl,
    }).promise();
  } catch (e) {
    return callback(e);
  }

  return callback(null, 'record enriched successfully and sent to queue');
};

export default handler;
