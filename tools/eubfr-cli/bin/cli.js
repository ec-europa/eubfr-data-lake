#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

// Utilities
const getCredentials = require('../lib/getProducerCredentials');
const getAllProducers = require('../lib/getAllProducers');

// Commands
const uploadFiles = require('../commands/upload');
const showFile = require('../commands/show');
const deleteFiles = require('../commands/delete');

const missingRequiredInput = '\n error: Missing required input parameters';

// If -p is passed without actual value, it will be boolean true
// Which is useless information in our case
const hasValidProducer = options =>
  options.producer &&
  options.producer !== '' &&
  typeof options.producer !== 'boolean';

program.version(pkg.version).usage('[command] [option]');

program
  .command('upload [files...]')
  .description('Uploads content to the data lake.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action((files, options) => {
    let credentials = [];
    const producerIsSet = hasValidProducer(options);
    const filesAreSet = files.length !== 0;

    if (!producerIsSet && filesAreSet) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    if (producerIsSet) {
      const { producer } = options;
      credentials = [{ [producer]: getCredentials(producer) }];
    }

    if (!producerIsSet && !filesAreSet) {
      console.log('All files for all producers will be uploaded.');
      const producers = getAllProducers();
      credentials = producers.map(producer => ({
        [producer]: getCredentials(producer),
      }));
    }

    uploadFiles({ files, credentials });
  });

program
  .command('show [file]')
  .description('Displays files of a given producer.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action((file, options) => {
    const { producer } = options;

    // Ensure useful input
    if (!producer && !file) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    if (producer && !hasValidProducer(options)) {
      console.error('\n error: Please specificy producer with a name.');
      process.exit(1);
    }

    if (producer && file && hasValidProducer(options)) {
      console.error('\n error: Pass file or producer only, not both.');
      process.exit(1);
    }

    showFile({ file, producer });
  });

program
  .command('delete [files...]')
  .description('Deletes files by computed_key field.')
  .action(files => {
    const producers = getAllProducers();
    const credentials = producers.map(producer => ({
      [producer]: getCredentials(producer),
    }));

    deleteFiles({ files, credentials });
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
