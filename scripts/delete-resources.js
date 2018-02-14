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
  // ES is tied to the environment (dev, test, prod) and should not be deleted with the stage
  // If you want to remove it, do it manually
  // 'resources-elasticsearch',
]);
