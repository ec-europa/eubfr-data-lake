#!/usr/bin/env node

require(`./utils/protectStage`)();

// Dependencies
const deleteServerlessService = require('./utils/deleteServerlessService');

const services = ['resources-elasticsearch'];

services.forEach(deleteServerlessService);
