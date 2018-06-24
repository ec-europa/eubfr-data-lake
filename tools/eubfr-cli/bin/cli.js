#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

// Utilities
const getCredentials = require('../lib/getProducerCredentials');

// Commands
const upload = require('../commands/upload');
const list = require('../commands/list');
const deleteFile = require('../commands/delete');

// General tweaks for CLI
process.on('unhandledRejection', console.error);
process.noDeprecation = true;

program.version(pkg.version).usage('[command] [option]');

program
  .command('upload <file> [moreFiles...]')
  .description('Uploads a new file to the data lake')
  .option('-p, --producer [producer]', "Producer's name. Defaults to 'agri'.")
  .action((file, moreFiles, options) => {
    const producer = options.producer || 'agri';
    const credentials = getCredentials(producer);

    upload({ file, credentials });
  });

program
  .command('list [file]')
  .description('Lists files of a given producer. Single file if provided.')
  .option('-p, --producer [producer]', "Producer's name. Defaults to 'agri'.")
  .action((file, options) => {
    const producer = options.producer || 'agri';

    list({ file, producer });
  });

program
  .command('delete [computedKey]')
  .description('Deletes a file of a given producer.')
  .option('-p, --producer [producer]', "Producer's name. Defaults to 'agri'.")
  .action((computedKey, options) => {
    const producer = options.producer || 'agri';
    const credentials = getCredentials(producer);

    deleteFile({ computedKey, credentials });
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
