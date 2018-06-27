#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

// Utilities
const getCredentials = require('../lib/getProducerCredentials');
const getAllProducers = require('../lib/getAllProducers');

// Commands
const upload = require('../commands/upload');
const show = require('../commands/show');
const deleteFiles = require('../commands/delete');

program.version(pkg.version).usage('[command] [option]');

program
  .command('upload [files...]')
  .description('Uploads content to the data lake')
  .option('-p, --producer [producer]', "Producer's name.")
  .action((files, options) => {
    let credentials = [];
    // If -p is passed without actual value, it will be boolean true
    // Which is useless information in our case
    const producerIsSet =
      options.producer &&
      options.producer !== '' &&
      typeof options.producer !== 'boolean';
    const filesAreSet = files.length !== 0;

    if (!producerIsSet && filesAreSet) {
      console.log('Please provide a producer with -p flag and value after it.');
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
  .description('Deletes files by computedKey.')
  .option(
    '-p, --producer [producer]',
    "Producer's name.If not set, all producers."
  )
  .option('-a, --all [all]', 'Delete all files. By producer if provided.')
  .action((files, options) => {
    const deleteAll = options.all;
    const credentials = [];

    if (files.length === 0 && !deleteAll && !options.producer) {
      return console.log('Files or an option flag required.');
    }

    if (deleteAll && files.length !== 0) {
      return console.log(
        '\n Flag for deleting all files is set, but still files are passed along.\n Please correct by either only leaving the set of selected files or remove them and delete all.'
      );
    }

    const producer = options.producer ? [options.producer] : getProducers();

    producer.forEach(name => {
      const creds = getCredentials(name);
      credentials.push(creds);
    });

    deleteFiles({ files, deleteAll, producer, credentials });
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
