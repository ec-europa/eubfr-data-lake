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
      apiVersion: '6.0',
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
    .then(res => {
      // res.hits.hits is [] in 0 records matching the query
      const results = res.hits.hits;

      if (results.length) {
        console.log('Syncing locations index with projects index');

        results.forEach(project => {
          const projectId = project._id;
          const projectLocation = project._source.project_locations;

          // prepare information for location index
          const location = {
            projectId,
            location: projectLocation,
          };

          // save to locations index
          clients.to.index({
            index: indices.to.index,
            type: indices.to.type,
            body: location,
          });
        });
      }
    })
    .catch(console.log);
};
