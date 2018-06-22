#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

process.on('unhandledRejection', console.error);

process.noDeprecation = true;
