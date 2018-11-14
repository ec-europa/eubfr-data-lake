import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import request from 'request-promise-native';

export const handler = async (event, context, callback) => {
  const { SERVICE_NAME, SERVICE_ENDPOINT } = process.env;

  const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

  // Extract message
  const sqsRecord = event.Records ? event.Records[0] : undefined;
  const eventInitial = sqsRecord.body;

  const eventParsed = JSON.parse(eventInitial);
  const eventArn = eventParsed.Records['0'].EventSubscriptionArn;

  // Topic is ${self:provider.stage}-onEnrichRecordRequested
  const topic = eventArn.split(':')[5];
  const functionParts = topic.split('-');
  const handlerName = functionParts.pop();

  // Handler is ${self:provider.stage}-${self:service}-onEnrichRecordRequested
  functionParts.push(SERVICE_NAME);
  functionParts.push(handlerName);
  const functionName = functionParts.join('-');

  try {
    // If service is not available, the handler will fail.
    // And since it is attached to an SQS queue, it will retry until it succeeds.
    await request.get({ url: SERVICE_ENDPOINT });

    // Execute original handler if the service has come back online.
    const params = {
      FunctionName: functionName,
      InvocationType: 'Event',
      LogType: 'Tail',
      Payload: Buffer.from(eventInitial, 'utf8'),
    };

    const result = await lambda.invoke(params).promise();
    return callback(null, result);
  } catch (e) {
    return callback(e);
  }
};

export default handler;
