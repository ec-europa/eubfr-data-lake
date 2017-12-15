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
    .search({
      index: esOptions.API,
      type: 'project',
      q: `computed_key:"${Key}"`,
    })
    .then(results => {
      console.log('Sync locations index with projects index');
      console.log(results);
    })
    .catch(console.log);
};
