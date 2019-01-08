import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = async event => {
  const { SERVICE_NAME } = process.env;

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
    // Re-try original handler by re-running it.
    const params = {
      FunctionName: functionName,
      InvocationType: 'Event',
      LogType: 'Tail',
      Payload: Buffer.from(eventInitial, 'utf8'),
    };

    await lambda.invoke(params).promise();
  } catch (e) {
    throw e;
  }
};

export default handler;
