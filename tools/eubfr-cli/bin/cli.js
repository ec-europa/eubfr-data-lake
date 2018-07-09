#!/usr/bin/env node

const program = require('commander');
const readline = require('readline');
const pkg = require('../package.json');

// Utilities
const getCredentials = require('../lib/getProducerCredentials');
const getEndpoints = require('../lib/getEndpoints');
const getAllProducers = require('../lib/getAllProducers');

// Commands
const uploadFiles = require('../commands/upload');
const showFile = require('../commands/show');
const deleteFiles = require('../commands/delete');

// If -p is passed without actual value, it will be boolean true
// Which is useless information in our case
const hasValidProducer = options =>
  options.producer && typeof options.producer !== 'boolean';

const endpoints = getEndpoints();
const missingRequiredInput = '\n error: Missing required input parameters';

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

    uploadFiles({ files, credentials, endpoints });
  });

program
  .command('show [file]')
  .description('Displays files of a given producer.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action(async (file, options) => {
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

    await showFile({ file, producer, endpoints });
  });

program
  .command('delete [files...]')
  .description('Deletes files by computed_key field.')
  .option('-c, --confirm [confirm]', 'Flag certainty of an operation.')
  .action(async (files, options) => {
    const producers = getAllProducers();
    const credentials = producers.map(producer => ({
      [producer]: getCredentials(producer),
    }));

    if (options.confirm) {
      await deleteFiles({ files, credentials, endpoints });
    } else {
      // Initiate the prompt interface.
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('Are you sure? <yes|y> ', async answer => {
        if (answer === 'y' || answer === 'yes') {
          await deleteFiles({ files, credentials, endpoints });
        }

        rl.close();
      });
    }
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
