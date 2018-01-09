#!/usr/bin/env node

require('./utils/protectStage')();

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const services = [
  'storage-objects',
  'storage-signed-uploads',
  'storage-deleter',
  'storage-meta-index',
  'harmonized-storage',
  'ingestion-manager',
  'ingestion-cleaner',
  'ingestion-etl-agri-csv',
  'ingestion-etl-budg-xls',
  'ingestion-etl-inforegio-json',
  'ingestion-etl-inforegio-xml',
  'value-store-projects',
  'logger-listener',
];

services.forEach(deleteServerlessService);
