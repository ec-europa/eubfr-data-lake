#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

process.on('unhandledRejection', console.error);

process.noDeprecation = true;

program
  .version(pkg.version)
  .usage('eubfr-cli [command] [option]')
  .option('-f, --file [file]', 'file to upload');

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
