import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import connectionClass from 'http-aws-es';
import elasticsearch from 'elasticsearch';
import Logger from '@eubfr/logger-listener/src/lib/Logger';

// Env vars
const { META_ENDPOINT, META_INDEX, REGION, STAGE } = process.env;

const shouldPersist = message => !!message.persist;
const getAccountId = context => context.invokedFunctionArn.split(':')[4];
const getClients = context => {
  // AWS clients
  const sns = new AWS.SNS();

  const accountId = getAccountId(context);

  this.loggerIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`;
  this.metaIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;

  this.logsLoggerclient = new Logger({
    sns,
    targetArn: this.loggerIndexSnsEndpointArn,
    emitter: context.invokedFunctionArn,
  });

  this.metaIndexClient = elasticsearch.Client({
    host: `https://${META_ENDPOINT}`,
    apiVersion: '6.0',
    connectionClass,
    index: META_INDEX,
  });

  return {
    logs: {
      logger: this.logsLoggerclient,
    },
    meta: {
      es: this.metaIndexClient,
      sns,
    },
  };
};

const MessengerFactory = {
  Create({ context }) {
    MessengerFactory.context = context;
    MessengerFactory.clients = getClients(context);

    return Object.create(this.messenger);
  },

  messenger: {
    send({ message, to }) {
      // In case message should be saved to persistence directly.
      // For example when initial meta message is to be created.
      if (shouldPersist(message)) {
        if (message.persist.in && message.persist.in.includes('meta')) {
          const item = message.persist.body;

          MessengerFactory.clients.meta.es.index({
            index: META_INDEX,
            type: 'file',
            body: item,
          });
        }
      }

      if (to.includes('logs')) {
        MessengerFactory.clients.logs.logger.info({ message });
      }

      if (to.includes('meta')) {
        const accountId = getAccountId(MessengerFactory.context);
        const TargetArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;

        MessengerFactory.clients.meta.sns
          .publish({
            Message: JSON.stringify({
              default: JSON.stringify({
                key: message.computed_key,
                status: message.status_code,
                message: message.status_message,
              }),
            }),
            MessageStructure: 'json',
            TargetArn,
          })
          .promise();
      }
    },
    getIndexTypes: () => ['meta', 'logs'],
  },
};

export default MessengerFactory;
