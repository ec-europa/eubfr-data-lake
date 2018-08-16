#!/usr/bin/env node

const program = require('commander');
const readline = require('readline');

// Utilities
const ensureVariables = require('../lib/ensureVariables');
const getCredentials = require('../lib/getProducerCredentials');
const getEndpoints = require('../lib/getEndpoints');
const getAllProducers = require('../lib/getAllProducers');
const hasValidOption = require('../lib/hasValidOption');

// Commands
const uploadFiles = require('../commands/content/upload');
const showFile = require('../commands/content/show');
const deleteFiles = require('../commands/content/delete');

const missingRequiredInput = '\n error: Missing required input parameters';

/**
 * Upload content to the data lake.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli content upload -h
 * ```
 *
 * Examples:
 * 
 * Single file
 *
 * ```sh
 * $ npx eubfr-cli content upload .content/agri/agri_history.csv -p agri
 * ```
 *
 * Multiple files
 *
 * ```sh
 * $ npx eubfr-cli content upload .content/inforegio/EUBFR_VIEW_16052018.xml .content/inforegio/regio_projects.json -p inforegio
 *```

 * All files
 *
 * ```sh
 * $ npx eubfr-cli content upload
 * ```
 * @memberof Content
 * @name Upload
 * @public
 */
program
  .command('upload [files...]')
  .description('Upload content to the data lake.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action(async (files, options) => {
    const endpoints = getEndpoints();

    ensureVariables(['SIGNED_UPLOADS_API'], endpoints);

    let credentials = [];
    const producerIsSet = hasValidOption('producer', options);
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

    await uploadFiles({ files, credentials, endpoints });
  });

/**
 * Display files of a given producer.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli content show -h
 * ```
 *
 * Examples:
 * - specific file by `computed_key`: `npx eubfr-cli content show agri/16598a36-db86-42a0-8041-c0d85021ad97.csv`
 * - all files of a given producer: `npx eubfr-cli content show -p agri`
 *
 * Please note that if you are sure there's an existing content, but you can't see it with this command, you'll need to double-check `eubfr-data-lake/demo/dashboard/client/.env` file to contain the correct value for `REACT_APP_STAGE`. If it's not the same as config.json's `stage`, run `npx eubfr-cli env generate-variables` to refresh the value of `REACT_APP_STAGE`.
 *
 * @memberof Content
 * @name Show
 * @public
 */
program
  .command('show [file]')
  .description('Display files of a given producer.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action(async (file, options) => {
    const endpoints = getEndpoints();
    ensureVariables(['REACT_APP_STAGE', 'ES_PRIVATE_ENDPOINT'], endpoints);

    const { producer } = options;

    // Ensure useful input
    if (!producer && !file) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    if (producer && !hasValidOption('producer', options)) {
      console.error('\n error: Please specificy producer with a name.');
      process.exit(1);
    }

    if (producer && file && hasValidOption('producer', options)) {
      console.error('\n error: Pass file or producer only, not both.');
      process.exit(1);
    }

    await showFile({ file, producer, endpoints });
  });

/**
 * Delete files by `computed_key` field.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli content delete -h
 * ```
 *
 * Examples:
 *
 * - delete one or multiple files: `npx eubfr-cli content delete agri/foo budg/bar inforegio/baz`
 * - delete all files of all producers `npx eubfr-cli content delete`
 *
 * By default, you will be prompted to confirm your intention. You can skip the this prompt by adding `--confirm` flag.
 *
 * @memberof Content
 * @name Delete
 * @public
 */
program
  .command('delete [files...]')
  .description('Delete files by computed_key field.')
  .option('-c, --confirm [confirm]', 'Flag certainty of an operation.')
  .action(async (files, options) => {
    const endpoints = getEndpoints();
    ensureVariables(
      ['DELETER_API', 'REACT_APP_STAGE', 'ES_PRIVATE_ENDPOINT'],
      endpoints
    );

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
