import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const checkAccess = userArn => {
  if (!userArn) throw new Error('User must be authenticated');

  const iam = new AWS.IAM();
  return iam
    .listGroupsForUser({
      UserName: userArn.split(':')[5].replace('user/', ''),
    })
    .promise()
    .then(data => data.Groups.some(group => group.GroupName === 'Producers'));
};

export default checkAccess;
