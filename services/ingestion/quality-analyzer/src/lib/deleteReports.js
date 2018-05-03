export default ({ client, index, key }) =>
  client.deleteByQuery({
    index,
    type: 'report',
    q: `_id:"${key}"`,
  });
