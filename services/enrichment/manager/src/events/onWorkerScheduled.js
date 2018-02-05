import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import Lawos from 'lawos';

export const handler = (event, context, callback) => {
  const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });
  const Lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

  const { REGION, QUEUE_NAME, lambda } = process.env;
  const accountId = context.invokedFunctionArn.split(':')[4];
  const queueUrl = `https://sqs.${REGION}.amazonaws.com/${accountId}/${QUEUE_NAME}`;

  const Q = new Lawos(queueUrl, SQS, Lambda);

  // Process every message with a lambda
  Q.item(lambda); // TODO: test if Q.list is faster

  // Run until all messages are processed or less than tens seconds runtime is left for the lambda function
  Q.work(() =>
    Promise.resolve(context.getRemainingTimeInMillis() < 10000)
  ).then(data => {
    callback(null, data);
  });
};

export default handler;
