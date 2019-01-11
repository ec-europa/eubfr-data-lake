import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

import deleteReports from '../lib/deleteReports';

export const handler = async event => {
  const { API, INDEX } = process.env;

  try {
    /**
     * Validate input.
     */

    if (!event.Records) {
      throw new Error('No record');
    }

    // Only work on the first record
    const snsRecord = event.Records[0];

    // Was the lambda triggered correctly? Is the file extension supported? etc.
    if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
      throw new Error('Bad record');
    }

    /**
     * Extract information from the event
     */

    // Extract S3 record
    const s3record = JSON.parse(snsRecord.Sns.Message).Records[0];

    // elasticsearch client configuration
    const options = {
      host: `https://${API}`,
      apiVersion: '6.2',
      connectionClass,
      index: INDEX,
    };

    // elasticsearch client instantiation
    const client = elasticsearch.Client(options);

    /**
     * Delete existing reports.
     */
    await deleteReports({
      client,
      index: INDEX,
      key: s3record.s3.object.key,
    });
  } catch (e) {
    throw e;
  }
};

export default handler;
