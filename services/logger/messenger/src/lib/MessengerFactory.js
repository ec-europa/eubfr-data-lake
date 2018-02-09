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

  return {
    logs: logsLoggerclient,
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
            let level = 'info';

            if (message.status_code === STATUS.ERROR) {
              level = 'error';
            } else if (message.status_code === STATUS.INGESTED) {
              level = 'success';
            }

            // Return promise from AWS SNS "publish".promise()
            return MessengerFactory.clients[channel].log({ level, message });
          }

          // consistent-return
          return Promise.resolve(true);
        })
      );
    },

    // Expose available channels.
    getSupportedChannels: () => ['logs'],
  },
};

export default MessengerFactory;
