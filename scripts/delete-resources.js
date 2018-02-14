#!/usr/bin/env node

require(`./utils/protectStage`)();

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const deleteResources = async resources =>
  Promise.all(resources.map(deleteServerlessService));

// Start
deleteResources([
  'resources-raw-storage',
  'resources-harmonized-storage',
  'resources-elasticsearch',
]);
