const AWS = require('aws-sdk');

const listExports = async ({ exp, nextToken, region }) => {
  const cloudFormation = new AWS.CloudFormation({ region });
  // eslint-disable-next-line
  exp = exp || [];
  const results = await cloudFormation
    .listExports({ NextToken: nextToken })
    .promise();

  if (results.NextToken) {
    return listExports({ exp, nextToken: results.NextToken, region });
  }

  return results;
};

const getExportValueByName = async ({ name, region }) => {
  const results = await listExports({ region });
  return results.Exports.find(exp => exp.Name === name).Value;
};

module.exports = getExportValueByName;
