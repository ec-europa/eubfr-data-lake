import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export default (esOptions, s3record) => {
  const Key = s3record.s3.object.key;

  // elasticsearch client configuration
  const options = {
    host: `https://${esOptions.API}`,
    apiVersion: '5.5',
    connectionClass,
    index: esOptions.INDEX,
  };

  // elasticsearch client instantiation
  const client = elasticsearch.Client(options);

  client
    .deleteByQuery({
      index: esOptions.API,
      type: 'location',
      q: `computed_key:"${Key}"`,
    })
    .then(console.log)
    .catch(console.log);
};
