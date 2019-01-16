import path from 'path';

const extractMessage = event => {
  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly?
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return new Error('Bad record');
  }

  // Extract message
  const message = JSON.parse(snsRecord.Sns.Message);

  // Check file extension
  if (path.extname(message.object.key) !== '.xml') {
    return new Error('File extension should be .xml');
  }

  return message;
};

export default extractMessage;
