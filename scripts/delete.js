#!/usr/bin/env node

require(`./utils/protectStage`)();

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const services = [
  // Serivces
  `storage-objects`,
  `ingestion-etl-results`,
  `storage-signed-uploads`,
  `storage-deleter`,
  `storage-meta-index`,
  `harmonized-storage`,
  `ingestion-manager`,
  `ingestion-cleaner`,
  `ingestion-etl-agri-csv`,
  `ingestion-etl-budg-xls`,
  `ingestion-etl-inforegio-json`,
  `value-store-projects`,
  // Resources
  `resources-elasticsearch`,
];

services.forEach(deleteServerlessService);
