const uuid = require('uuid');

export default (client, table, data, cb = () => {}) => {
  const params = {
    TableName: table,
    Item: Object.assign(
      {
        id: uuid.v1(),
      },
      data
    ),
  };

  client.put(params, err => {
    if (err) {
      return cb(err);
    }

    return cb(null, 'All fine');
  });
};
