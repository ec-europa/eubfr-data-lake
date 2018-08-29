import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import { extractMessage } from '../lib/sns';

export const handler = async (event, context, callback) => {
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
        status_message:
          'Regular ETL handler failed. Starting a separate long-running task.',
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    const runParams = {
      taskDefinition: 'runner1:1',
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: 'ENABLED',
          subnets: ['subnet-ea11e581'],
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
            ],
            name: 'runner1',
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
