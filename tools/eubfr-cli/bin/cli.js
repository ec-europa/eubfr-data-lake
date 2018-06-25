#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

// Utilities
const getCredentials = require('../lib/getProducerCredentials');

// Commands
const upload = require('../commands/upload');
const show = require('../commands/show');
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
    // The `file` is required.
    const files = [file];
    const producer = options.producer || 'agri';
    const credentials = getCredentials(producer);

    if (moreFiles.length) {
      files.push(...moreFiles);
    }

    upload({ files, credentials });
  });

program
  .command('show [file]')
  .description('Displays files of a given producer.')
  .option('-p, --producer [producer]', "Producer's name. Defaults to 'agri'.")
  .action((file, options) => {
    const producer = options.producer || 'agri';

    show({ file, producer });
  });

program
  .command('delete [files...]')
  .description('Deletes files by computedKey. All if nothing passed.')
  .option('-p, --producer [producer]', "Producer's name. Defaults to 'agri'.")
  .option('-a, --all [all]', 'Mark all files for deletion')
  .action((files, options) => {
    let deleteAll = true;
    // Respect flags for specific deletions
    if (files.length || options.all === false) {
      deleteAll = false;
    }
    const producer = options.producer || 'agri';
    const credentials = getCredentials(producer);

    deleteFile({ files, deleteAll, producer, credentials });
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
