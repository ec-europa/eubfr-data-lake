import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import backoff from 'backoff';
import request from 'request-promise-native';

export const handler = (event, context, callback) => {
  const { SERVICE_ENDPOINT } = process.env;

  const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

  // Extract message
  const sqsRecord = event.Records ? event.Records[0] : undefined;
  const eventInitial = sqsRecord.body;

  const eventParsed = JSON.parse(eventInitial);
  const eventArn = eventParsed.Records['0'].EventSubscriptionArn;
  // Topic is ${self:provider.stage}-onEnrichRecordRequested
  const topic = eventArn.split(':')[5];
  // Handler is ${self:provider.stage}-${self:service}-onEnrichRecordRequested
  const service = 'enrichment-fields-budget';
  const functionParts = topic.split('-');
  const handlerName = functionParts.pop();
  functionParts.push(service);
  functionParts.push(handlerName);
  const functionName = functionParts.join('-');

  try {
    const call = backoff.call(
      request.get,
      { url: SERVICE_ENDPOINT },
      (err, res) => {
        const project = JSON.parse(eventParsed.Records['0'].Sns.Message);
        const retryCount = call.getNumRetries;

        console.log(`${SERVICE_ENDPOINT} was down with ${res.statusCode} code`);
        console.log(`Retry project ID ${project.project_id}: ${retryCount}`);

        if (err) return callback(err);

        // Execute original handler if the service has come back online.
        const params = {
          FunctionName: functionName,
          InvocationType: 'Event',
          LogType: 'Tail',
          Payload: Buffer.from(eventInitial, 'utf8'),
        };

        return lambda.invoke(params, (lambdaServiceError, data) => {
          if (lambdaServiceError) callback(lambdaServiceError);
          return callback(null, data);
        });
      }
    );

    call.retryIf(
      err => err.status !== 200 || err.status === 500 || err.status === 502
    );
    call.setStrategy(new backoff.ExponentialStrategy({ initialDelay: 500 }));
    call.failAfter(10);
    return call.start();
  } catch (e) {
    return callback(e);
  }
};

export default handler;
