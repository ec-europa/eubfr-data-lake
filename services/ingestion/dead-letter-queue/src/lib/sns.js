const getSnsRecord = event => {
  // Only work on the first record
  const snsRecord = event.Records ? event.Records[0] : undefined;

  // Was the lambda triggered correctly?
  if (!snsRecord || snsRecord.EventSource !== 'aws:sns') {
    return new Error('Bad record');
  }

  return snsRecord;
};

export const extractMessage = event => {
  const snsRecord = getSnsRecord(event);
  const message = JSON.parse(snsRecord.Sns.Message);
  return message;
};

export const extractTopic = event => {
  const snsRecord = getSnsRecord(event);
  const topic = snsRecord.Sns.TopicArn;
  return topic;
};
