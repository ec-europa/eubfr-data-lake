import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = async (event, context, callback) => {
  // Extract env vars
  const { REGION } = process.env;

  if (!REGION) {
    return callback(new Error('REGION environment variables is required!'));
  }

  // clients
  const ec2 = new AWS.EC2({ region: REGION });

  const filters = {
    DryRun: false,
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['running'],
      },
      {
        Name: 'tag:automatedStop',
        Values: ['true'],
      },
    ],
  };

  try {
    const instances = [];
    const response = await ec2.describeInstances(filters).promise();

    response.Reservations.forEach(reservation =>
      reservation.Instances.forEach(instance => {
        // If not terminated
        if (instance.State.Code !== 48) {
          instances.push(instance.InstanceId);
        }
      })
    );

    if (instances.length) {
      console.log(`Stopping instances: ${instances.join(', ')}`);
    }

    const params = {
      InstanceIds: instances,
      DryRun: false,
      Force: false,
    };

    try {
      await ec2.stopInstances(params).promise();
      return callback();
    } catch (stopError) {
      return callback(stopError);
    }
  } catch (e) {
    return callback(e);
  }
};

export default handler;
