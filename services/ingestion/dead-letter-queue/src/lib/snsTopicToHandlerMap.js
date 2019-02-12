/**
 * How to find the keys:
 *
 * - They are SNS topics names without stage prefix.
 * - In the service, next to the sns event subscription, there's `topicName`, take it without the prefix.
 *
 * How to find the values for the object with `name` and `path` keys:
 *
 * - `name` is the service name concatenated with the handler name
 * - `path` is the physical path to the handler's source code as of the root of the service.
 */

const snsTopicToHandlerMap = {
  'etl-cordis-csv': {
    name: 'ingestion-etl-cordis-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
  'etl-devco-xls': {
    name: 'ingestion-etl-devco-xls-parseXls',
    path: 'src/events/onParseXls',
  },
  'etl-devco-xlsx': {
    name: 'ingestion-etl-devco-xls-parseXls',
    path: 'src/events/onParseXls',
  },
  'etl-devco-xlsm': {
    name: 'ingestion-etl-devco-xls-parseXls',
    path: 'src/events/onParseXls',
  },
  'etl-eac-csv': {
    name: 'ingestion-etl-eac-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
  'etl-euinvest-csv': {
    name: 'ingestion-etl-euinvest-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
  'etl-euresults-csv': {
    name: 'ingestion-etl-euresults-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
  'etl-fts-xls': {
    name: 'ingestion-etl-fts-xls-parseXls',
    path: 'src/events/onParseXLS',
  },
  'etl-fts-xlsx': {
    name: 'ingestion-etl-fts-xls-parseXls',
    path: 'src/events/onParseXLS',
  },
  'etl-home-xls': {
    name: 'ingestion-etl-home-xls-parseXls',
    path: 'src/events/onParseXLS',
  },
  'etl-home-xlsx': {
    name: 'ingestion-etl-home-xls-parseXls',
    path: 'src/events/onParseXLS',
  },
  'etl-iati-csv': {
    name: 'ingestion-etl-iati-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
  'etl-inforegio-json': {
    name: 'ingestion-etl-inforegio-json-parseJson',
    path: 'src/events/onParseJSON',
  },
  'etl-inforegio-xml': {
    name: 'ingestion-etl-inforegio-xml-parseXML',
    path: 'src/events/onParseXML',
  },
  'etl-just-csv': {
    name: 'ingestion-etl-just-csv-parseCsv',
    path: 'src/events/onParseCSV',
  },
  'etl-wifi4eu-xls': {
    name: 'ingestion-etl-wifi4eu-xls-parseXls',
    path: 'src/events/onParseXLS',
  },
  'etl-wifi4eu-xlsx': {
    name: 'ingestion-etl-wifi4eu-xls-parseXls',
    path: 'src/events/onParseXLS',
  },
  'harmonized-object-created': {
    name: 'value-store-projects-onObjectCreated',
    path: 'src/events/onObjectCreated',
  },
};

export default snsTopicToHandlerMap;
