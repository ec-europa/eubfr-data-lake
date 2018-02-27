#!/usr/bin/env node

require('../utils/protectStage')();

// Dependencies
const deleteServerlessService = require('../utils/deleteServerlessService');

const deleteServices = async services =>
  Promise.all(services.map(deleteServerlessService));

// Start the deletion
deleteServices([
  'storage-signed-uploads',
  'storage-deleter',
  'ingestion-manager',
  'ingestion-cleaner',
  'ingestion-etl-agri-csv',
  'ingestion-etl-budg-xls',
  'ingestion-etl-inforegio-json',
  'ingestion-etl-inforegio-xml',
  'ingestion-etl-valor-xls',
  'value-store-projects',
  'logger-listener',
  'enrichment-manager',
]);
