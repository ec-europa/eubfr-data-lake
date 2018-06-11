export default ({ client, index, key }) =>
  client.deleteByQuery({
    index,
    type: 'project',
    q: `computed_key:"${key}"`,
  });
