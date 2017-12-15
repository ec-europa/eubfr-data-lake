import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

export default (esOptions, s3record) => {
  const clients = {};

  const Key = s3record.s3.object.key;

  const indices = {
    from: {
      index: 'projects',
      type: 'project',
    },
    to: {
      index: 'locations',
      type: 'location',
    },
  };

  Object.keys(indices).forEach(i => {
    // elasticsearch client configuration
    const options = {
      host: `https://${esOptions.API}`,
      apiVersion: '5.5',
      connectionClass,
      index: indices[i].index,
    };

    clients[i] = elasticsearch.Client(options);
  });

  // add latest changes from projects index to locations index
  clients.from
    .search({
      // index and type will narrow the search
      index: indices.from.index,
      type: indices.from.type,
      q: `computed_key:"${Key}"`,
    })
    .then(results => {
      console.log('Sync locations index with projects index');
      console.log(results);
    })
    .catch(console.log);
};
