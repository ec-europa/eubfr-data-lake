const chunkSplit = (arr, chunkSize) => {
  const R = [];
  const len = arr.length;
  for (let i = 0; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
  return R;
};

const batchDelete = ({ documentClient, table, key }, items) => {
  // Group items by chunks of 25
  const chunks = chunkSplit(items, 25);

  return Promise.all(
    chunks.map(chunk =>
      documentClient
        .batchWrite({
          RequestItems: {
            [table]: chunk.map(item => ({
              DeleteRequest: {
                Key: {
                  computed_key: key,
                  project_id: item.project_id,
                },
              },
            })),
          },
        })
        .promise()
    )
  );
};

export default ({ documentClient, table, key }) => {
  const params = {
    TableName: table,
    KeyConditionExpression: 'computed_key = :key',
    ExpressionAttributeValues: {
      ':key': key,
    },
    ProjectionExpression: 'computed_key, project_id',
  };

  return documentClient
    .query(params)
    .promise()
    .then(data => batchDelete({ documentClient, table, key }, data.Items));
};
