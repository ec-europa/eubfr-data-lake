import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = (event, context, callback) => {
  JSON.stringify(event);
  callback();
};

export default handler;
