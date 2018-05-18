export default ({ client, index, key }) =>
  client.deleteByQuery({
    index,
    type: 'project',
    q: `body.computed_key:"${key}"`,
  });
