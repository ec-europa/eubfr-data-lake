import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import connectionClass from 'http-aws-es';
import elasticsearch from 'elasticsearch';
import Logger from '@eubfr/logger-listener/src/lib/Logger';
import { STATUS } from './status';

// Env vars
const { META_ENDPOINT, META_INDEX, REGION, STAGE } = process.env;

const shouldPersist = message => !!message.persist;
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

  const metaIndexClient = elasticsearch.Client({
    host: `https://${META_ENDPOINT}`,
    apiVersion: '6.0',
    connectionClass,
    index: META_INDEX,
  });

  return {
    logs: {
      logger: logsLoggerclient,
    },
    meta: {
      logger: metaLoggerclient,
      es: metaIndexClient,
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
      // In case message should be saved to persistence directly.
      // For example when initial meta message is to be created.
      if (shouldPersist(message)) {
        if (message.persist.in && message.persist.in.includes('meta')) {
          MessengerFactory.clients.meta.es.index({
            index: META_INDEX,
            type: 'file',
            body: message.persist.body,
          });
        }
      }

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
