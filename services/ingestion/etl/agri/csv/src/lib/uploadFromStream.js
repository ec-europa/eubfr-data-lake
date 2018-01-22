import stream from 'stream';
import { prepareMessage } from './sns';
import { STATUS } from '../../../../../../storage/meta-index/src/lib/status';

// Load
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
          message: 'ETL successful',
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
