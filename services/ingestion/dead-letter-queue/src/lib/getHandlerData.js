import snsTopicToHandlerMap from './snsTopicToHandlerMap';

const getSuffix = topic => {
  const parts = topic.split(':');
  const last = parts[parts.length - 1];
  // Remove `stage` part of the naming
  return last
    .split('-')
    .slice(1)
    .join('-');
};

const getHandlerData = topic => {
  const data = {};
  const suffix = getSuffix(topic);
  if (suffix in snsTopicToHandlerMap) return snsTopicToHandlerMap[suffix];
  return data;
};

export default getHandlerData;
