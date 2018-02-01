import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import Logger from '@eubfr/logger-listener/src/lib/Logger';
import { STATUS } from './status';

// Env vars
const { REGION, STAGE } = process.env;

const getLambdaArn = context => context.invokedFunctionArn;
const getAccountId = context => getLambdaArn(context).split(':')[4];

const getClients = context => {
  const emitter = getLambdaArn(context);
  const accountId = getAccountId(context);
  const snsEndpoint = `arn:aws:sns:${REGION}:${accountId}:${STAGE}`;

  // AWS clients
  const sns = new AWS.SNS();

  const logsLoggerclient = new Logger({
    sns,
    targetArn: `${snsEndpoint}-onLogEmitted`,
    emitter,
  });

  const metaLoggerclient = new Logger({
    sns,
    targetArn: `${snsEndpoint}-MetaStatusReported`,
    emitter,
  });

  return {
    logs: logsLoggerclient,
    meta: metaLoggerclient,
  };
};

const MessengerFactory = {
  Create({ context }) {
    MessengerFactory.clients = getClients(context);

    return Object.create(this.messenger);
  },

  messenger: {
    send({ message, to }) {
      return Promise.all(
        to.map(channel => {
          if (MessengerFactory.clients[channel]) {
            const level =
              message.status_code === STATUS.ERROR ? 'error' : 'info';

            // Return promise from AWS SNS "publish".promise()
            return MessengerFactory.clients[channel].log({ level, message });
          }

          // consistent-return
          return Promise.resolve(true);
        })
      );
    },

    // Expose available channels.
    getSupportedChannels: () => ['meta', 'logs'],
  },
};

export default MessengerFactory;
