import { normalizeProject } from '../tables/projects';

export const save = ({ dynamo, table, data }, cb = () => {}) => {
  const params = {
    TableName: table,
    Item: data,
  };

  dynamo.putItem(params, err => {
    if (err) {
      return cb(err);
    }

    return cb(null, 'All fine');
  });
};

export const saveProject = ({ dynamo, table, event, data }, cb = () => {}) =>
  save(
    {
      dynamo,
      table,
      data: normalizeProject(
        Object.assign(
          {
            creation_date: event.eventTime, // already ISO-8601
            source: {
              producer: event.userIdentity.principalId,
              object_key: event.object.key,
            },
          },
          data
        )
      ),
    },
    cb
  );

export default save;
