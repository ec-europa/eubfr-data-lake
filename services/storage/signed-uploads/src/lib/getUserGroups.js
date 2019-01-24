import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const getUserGroups = username => {
  if (!username) throw new Error('User must be authenticated');

  const iam = new AWS.IAM();
  return iam
    .listGroupsForUser({
      UserName: username,
    })
    .promise();
};

export default getUserGroups;
