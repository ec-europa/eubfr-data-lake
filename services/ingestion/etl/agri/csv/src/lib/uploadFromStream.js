import stream from 'stream';
import { STATUS } from '@eubfr/storage-meta-index/src/lib/status';

import { prepareMessage } from './sns';

export default ({ key, BUCKET, s3, sns, endpointArn, onError, callback }) => {
  const pass = new stream.PassThrough();

  const params = {
    Bucket: BUCKET,
    Key: `${key}.ndjson`,
    Body: pass,
    ContentType: 'application/x-ndjson',
  };

  s3.upload(params, err => {
    if (err) {
      return onError(err);
    }

    // Publish message to ETL Success topic

    /*
     * Send the SNS message
     */
    return sns.publish(
      prepareMessage(
        {
          key,
          status: STATUS.PARSED,
          message:
            'ETL successfully uploaded a parsed (harmonized) version of incoming data!',
        },
        endpointArn
      ),
      snsErr => {
        if (snsErr) {
          callback(snsErr);
          return;
        }

        callback(null, 'push sent');
      }
    );
  });

  return pass;
};
