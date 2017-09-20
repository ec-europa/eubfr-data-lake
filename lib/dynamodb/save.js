import { normalizeProject } from './normalize';

export const save = (dynamo, table, data, cb = () => {}) => {
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

export const saveProject = (dynamo, table, project, cb = () => {}) =>
  save(dynamo, table, normalizeProject(project), cb);

export default save;
