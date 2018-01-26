import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import Logger from '@eubfr/logger-listener/src/lib/Logger';

const MessengerFactory = {
  Create({ context }) {
    // Extract env vars
    const { REGION, STAGE } = process.env;

    if (!REGION || !STAGE) {
      return new Error('REGION and STAGE environment variables are required!');
    }

    // AWS clients
    const sns = new AWS.SNS();

    // Get properties about the lambda function.
    const accountId = context.invokedFunctionArn.split(':')[4];

    this.loggerIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-onLogEmitted`;
    this.metaIndexSnsEndpointArn = `arn:aws:sns:${REGION}:${accountId}:${STAGE}-MetaStatusReported`;

    this.logsIndexClient = new Logger({
      sns,
      targetArn: this.loggerIndexSnsEndpointArn,
      emitter: context.invokedFunctionArn,
    });

    this.metaIndexClient = new Logger({
      sns,
      targetArn: this.metaIndexSnsEndpointArn,
      emitter: context.invokedFunctionArn,
    });

    return Object.create(this.messenger);
  },

  messenger: {
    send({ type, message, targets }) {
      switch (type) {
        case 'success':
          console.log('success');
          console.log(JSON.stringify(message));
          break;

        case 'error':
          console.log('error');
          console.log(JSON.stringify(message));
          break;

        default:
          console.log('info');
          console.log(JSON.stringify(message));
          break;
      }
    },
    getIndexTypes: () => [
      { meta: this.metaIndexSnsEndpointArn },
      { logs: this.loggerIndexSnsEndpointArn },
    ],
  },
};

export default MessengerFactory;
