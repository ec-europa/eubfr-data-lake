import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import { extractMessage, extractTopic, extractKey } from '../lib/extractors';
import getHandlerData from '../lib/getHandlerData';

export const handler = async (event, context) => {
  const { RUNNER, BUCKET, REGION, STAGE, CONTAINER, CLUSTER } = process.env;

  try {
    const ec2 = new AWS.EC2();
    const ecs = new AWS.ECS();
    const messenger = MessengerFactory.Create({ context });

    // Extract message
    const sqsRecord = event.Records ? event.Records[0] : undefined;

    const initialMessage = JSON.parse(sqsRecord.body);
    const message = extractMessage(initialMessage);
    const topicArn = extractTopic(initialMessage);
    const key = extractKey(message);

    const handlerData = getHandlerData(topicArn);

    await messenger.send({
      message: {
        computed_key: key,
        status_message: 'Restarting without time limitations ...',
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });

    const allSubnets = await ec2
      .describeSubnets({
        Filters: [
          {
            Name: 'defaultForAz',
            Values: ['true'],
          },
        ],
      })
      .promise();

    const subnets = allSubnets.Subnets.filter(
      subnet => subnet.State === 'available'
    ).map(subnet => subnet.SubnetId);

    const runParams = {
      taskDefinition: RUNNER,
      cluster: CLUSTER,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: 'ENABLED',
          subnets,
        },
      },
      overrides: {
        containerOverrides: [
          {
            environment: [
              {
                name: 'AWS_LAMBDA_HANDLER_EVENT',
                value: JSON.stringify(initialMessage),
              },
              {
                name: 'AWS_LAMBDA_HANDLER_CONTEXT',
                value: JSON.stringify(context),
              },
              {
                name: 'AWS_LAMBDA_HANDLER_NAME',
                value: `${STAGE}-${handlerData.name}`,
              },
              {
                name: 'AWS_LAMBDA_HANDLER_PATH',
                value: handlerData.path,
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
            name: CONTAINER,
          },
        ],
      },
    };

    const result = await ecs.runTask(runParams).promise();
    return result;
  } catch (e) {
    await messenger.send({
      message: {
        computed_key: key,
        status_message: e.message,
        status_code: STATUS.ERROR,
      },
      to: ['logs'],
    });
    throw e;
  }
};

export default handler;
