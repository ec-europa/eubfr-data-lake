import normalize from './normalize';

export default (dynamo, table, data, cb = () => {}) => {
  const params = {
    TableName: table,
    Item: normalize(data),
  };

  dynamo.putItem(params, err => {
    if (err) {
      return cb(err);
    }

    return cb(null, 'All fine');
  });
};
