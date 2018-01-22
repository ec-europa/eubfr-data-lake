export default ({ key, status, message }, endpointArn) => ({
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
