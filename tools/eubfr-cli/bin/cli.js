#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program.version(pkg.version).usage('[resource] [action]');

program.command('env', 'Environment management');
program.command('es', 'Elasticsearch management');
program.command('content', 'Content management');

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
