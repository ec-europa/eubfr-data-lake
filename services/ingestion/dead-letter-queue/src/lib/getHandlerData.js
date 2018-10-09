// List of topic suffixes mapping to their target handler executables.
const snsTopicsMap = {
  'etl-iati-csv': {
    name: 'ingestion-etl-iati-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
};

const getSuffix = topic => {
  const parts = topic.split(':');
  const last = parts[parts.length - 1];
  // Remove `stage` part of the naming
  return last
    .split('-')
    .slice(1)
    .join('-');
};

const handlerData = topic => {
  const data = {};
  const suffix = getSuffix(topic);
  if (suffix in snsTopicsMap) return snsTopicsMap[suffix];
  return data;
};

export default handlerData;
