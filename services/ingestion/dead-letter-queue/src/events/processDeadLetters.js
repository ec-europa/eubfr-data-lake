import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import { extractMessage } from '../lib/sns';

export const handler = async (event, context, callback) => {
  console.log(JSON.stringify('event >>>'));
  console.log(JSON.stringify(event));
  console.log(JSON.stringify('context >>>'));
  console.log(JSON.stringify(context));

  const { RUNNER, BUCKET, REGION, STAGE, SUBNET } = process.env;
  const ecs = new AWS.ECS();
  const messenger = MessengerFactory.Create({ context });

  // Extract message
  const sqsRecord = event.Records ? event.Records[0] : undefined;
  const initialMessage = JSON.parse(sqsRecord.body);
  const message = extractMessage(initialMessage);
  const { key } = message.object;

  try {
    await messenger.send({
      message: {
        computed_key: key,
        status_message: 'Restarting without time limitations.',
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    const runParams = {
      taskDefinition: RUNNER,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: 'ENABLED',
          subnets: [SUBNET],
        },
      },
      overrides: {
        containerOverrides: [
          {
            environment: [
              {
                name: 'AWS_LAMBDA_FUNCTION_EVENT',
                value: JSON.stringify(initialMessage),
              },
              // Help the runner locate the handler to run inside a container.
              {
                name: 'AWS_LAMBDA_HANDLER_PATH',
                value: 'src/events/onParseCSV.js',
              },
              {
                name: 'AWS_LAMBDA_FUNCTION_CONTEXT',
                value: JSON.stringify(context),
              },
              {
                name: 'BUCKET',
                value: BUCKET,
              },
              {
                name: 'REGION',
                value: REGION,
              },
              {
                name: 'STAGE',
                value: STAGE,
              },
            ],
            name: RUNNER,
          },
        ],
      },
    };

    const result = await ecs.runTask(runParams).promise();
    return callback(null, result);
  } catch (e) {
    await messenger.send({
      message: {
        computed_key: key,
        status_message: e.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });
    return callback(e);
  }
};

export default handler;
