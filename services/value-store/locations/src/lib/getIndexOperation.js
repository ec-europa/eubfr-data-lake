export default eventRecord => {
  const ops = {
    'ObjectCreated:Put': 'CREATE',
    'ObjectRemoved:Delete': 'DELETE',
  };

  return ops[eventRecord.eventName];
};
