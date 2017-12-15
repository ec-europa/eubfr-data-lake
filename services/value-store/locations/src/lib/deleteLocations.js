import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export default (esOptions, s3record) => {
  const index = `locations`;
  const type = `location`;
  const Key = s3record.s3.object.key;

  // elasticsearch client configuration
  const options = {
    host: `https://${esOptions.API}`,
    apiVersion: '6.0',
    connectionClass,
    index,
  };

  // elasticsearch client instantiation
  const client = elasticsearch.Client(options);

  client
    .deleteByQuery({ index, type, q: `computed_key:"${Key}"` })
    .then(console.log)
    .catch(console.log);
};
