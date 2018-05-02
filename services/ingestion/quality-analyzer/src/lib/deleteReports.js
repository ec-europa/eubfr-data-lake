export default ({ client, index, key }) =>
  client.deleteByQuery({
    index,
    type: 'report',
    q: `computed_key:"${key}"`,
  });
