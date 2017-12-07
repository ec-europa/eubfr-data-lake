#!/usr/bin/env node

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const services = [
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
  `elasticsearch`,
  `value-store-projects`,
];

services.forEach(deleteServerlessService);
