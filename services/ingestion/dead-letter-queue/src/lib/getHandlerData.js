// Keys are topics without prefix stages.
// Values are handler names (withot prefix stages) and path to handler code.
const snsTopicsMap = {
  'etl-cordis-csv': {
    name: 'ingestion-etl-cordis-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
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
