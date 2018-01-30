import stream from 'stream';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

export default async ({ key, BUCKET, s3, onError, context }) => {
  const pass = new stream.PassThrough();
  const messenger = MessengerFactory.Create({ context });

  const params = {
    Bucket: BUCKET,
    Key: `${key}.ndjson`,
    Body: pass,
    ContentType: 'application/x-ndjson',
  };

  await s3.upload(params, async err => {
    if (err) {
      return onError(err);
    }

    return messenger.send({
      message: {
        computed_key: key,
        status_message: 'ETL successful',
        status_code: STATUS.SUCCESS_ETL,
      },
      to: ['logs', 'meta'],
    });
  });

  return pass;
};
