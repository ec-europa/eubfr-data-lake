#!/usr/bin/env node

require('../utils/protectStage')();

// Dependencies
const deleteServerlessService = require('../utils/deleteServerlessService');

const deleteServices = async services =>
  Promise.all(services.map(deleteServerlessService));

// Start the deletion
deleteServices([
  'compute-stopper',
  'enrichment-fields-budget',
  'enrichment-fields-locations',
  'enrichment-manager',
  'enrichment-saver',
  'ingestion-manager',
  'ingestion-cleaner',
  'ingestion-etl-agri-csv',
  'ingestion-etl-budg-xls',
  'ingestion-etl-cordis-csv',
  'ingestion-etl-fts-xls',
  'ingestion-etl-home-xls',
  'ingestion-etl-inforegio-json',
  'ingestion-etl-inforegio-xml',
  'ingestion-etl-iati-csv',
  'ingestion-etl-valor-xls',
  'ingestion-etl-wifi4eu-xls',
  'ingestion-quality-analyzer',
  'value-store-projects',
  'logger-listener',
  'storage-signed-uploads',
  'storage-deleter',
]);
