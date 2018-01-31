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
    logs: {
      logger: logsLoggerclient,
    },
    meta: {
      logger: metaLoggerclient,
    },
  };
};

const MessengerFactory = {
  Create({ context }) {
    MessengerFactory.clients = getClients(context);

    return Object.create(this.messenger);
  },

  messenger: {
    send({ message, to }) {
      to.forEach(channel => {
        if (MessengerFactory.clients[channel]) {
          if (message.status_code === STATUS.ERROR) {
            MessengerFactory.clients[channel].logger.error({ message });
          }
          MessengerFactory.clients[channel].logger.info({ message });
        }
      });
    },
    // Expose available channels.
    getSupportedChannels: () => ['meta', 'logs'],
  },
};

export default MessengerFactory;
