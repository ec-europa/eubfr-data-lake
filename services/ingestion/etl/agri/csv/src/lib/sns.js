import path from 'path';

export const extractMessage = event => {
  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly?
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    throw new Error('Bad record');
  }

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (path.extname(message.object.key) !== '.csv') {
    throw new Error('File extension should be .csv');
  }

  return message;
};

export const prepareMessage = ({ key, status, message }, endpointArn) => ({
  Message: JSON.stringify({
    default: JSON.stringify({
      key,
      status,
      message,
    }),
  }),
  MessageStructure: 'json',
  TargetArn: endpointArn,
});
