#!/usr/bin/env node

require(`./utils/protectStage`)();

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const services = [
  'resources-raw-storage',
  'resources-harmonized-storage',
  'resources-elasticsearch',
];

services.forEach(deleteServerlessService);
