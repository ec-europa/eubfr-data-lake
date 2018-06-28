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

const requireProducer = `\n error: missing required option 'producer'`;

program.version(pkg.version).usage('[command] [option]');

program
  .command('upload [files...]')
  .description('Uploads content to the data lake.')
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
      console.log(requireProducer);
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
  .option('-p, --producer <producer>', "Producer's name.")
  .action((file, options) => {
    const { producer } = options;
    if (producer) {
      return showFile({ file, producer });
    }
    return console.log(requireProducer);
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
