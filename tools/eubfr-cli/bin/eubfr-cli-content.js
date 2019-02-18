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
const contentDeleteCommand = require('../commands/content/delete');
const contentDownloadCommand = require('../commands/content/download');
const contentShowCommand = require('../commands/content/show');
const contentUploadCommand = require('../commands/content/upload');

const missingRequiredInput = '\n error: Missing required input parameters';

/**
 * Get all necessary files for the data lake from a content repository.
 *
 * This command depends on an environment variable `EUBFR_CONTENT_REPOSITORY`.
 * It's the name of the S3 bucket which is the content repository.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli content download -h
 * ```
 *
 * Examples:
 *
 * Get only the files necessary to work with AGRI producer.
 *
 * ```sh
 * $ eubfr-cli content download -p agri
 * ```
 *
 * Download files in a specific folder if the script does not have permissions to write in default `.content`.
 *
 * ```sh
 * $ eubfr-cli content download -f /tmp
 * ```
 *
 * Download all files for all producers in default `.content` folder without interactions.
 *
 * ```sh
 * $ eubfr-cli content download --confirm
 * ```
 *
 * Download files and override existing.
 *
 * ```sh
 * $ eubfr-cli content download --override
 * ```
 *
 * @memberof Content
 * @name Download
 * @public
 */
program
  .command('download')
  .description('Get content for the data lake from a central repository.')
  .option('-f, --folder [folder]', 'Location for the downloads.')
  .option('-o, --override [override]', 'Existing files will be overriden.')
  .option('-p, --producer [producer]', "Producer's name.")
  .option('-c, --confirm [confirm]', 'Flag certainty of an operation.')
  .action(async options => {
    if (!process.env.EUBFR_CONTENT_REPOSITORY) {
      process.env.EUBFR_CONTENT_REPOSITORY = 'eubfr-content';
      console.info("EUBFR_CONTENT_REPOSITORY is 'eubfr-content' by default.");
      console.info('Change it to download content from another S3 bucket.');
    }

    const folderIsSet = hasValidOption('folder', options);
    const producerIsSet = hasValidOption('producer', options);

    // Set defaults if optional settings are not specified.
    const folder = folderIsSet ? options.folder : '.content';
    const producer = producerIsSet ? options.producer : '*';
    const override = options.override ? options.override : false;

    if (!folderIsSet && !producerIsSet) {
      console.log('All files for all producers will be downloaded.');
      console.log('This could be a slow and bandwidth-heavy operation!');
      console.log('Consider using --producer flag for a lighter download.');

      if (options.confirm) {
        await contentDownloadCommand({ folder, producer, override });
      } else {
        // Initiate the prompt interface.
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question('Are you sure? <yes|y> ', async answer => {
          if (answer === 'y' || answer === 'yes') {
            await contentDownloadCommand({ folder, producer, override });
          }

          rl.close();
        });
      }
    } else {
      // If the user has changed any of the two defaults, it's important to provide feedback about it, as the other CLI commands depend on them.
      if (folderIsSet) {
        console.log(`Files will be downloaded in folder: ${folder}.`);
        console.log('Use it when specifying path in upload operations.');
      }

      if (producerIsSet) {
        console.log(`Only files for ${producer} will be downloaded.`);
        console.log(
          'Please consider setting EUBFR_USERNAME in order to narrow down deployment and upload operations to this producer for the other operations as well.'
        );
      }

      if (options.confirm) {
        await contentDownloadCommand({ folder, producer, override });
      } else {
        // Initiate the prompt interface.
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question('Are you sure? <yes|y> ', async answer => {
          if (answer === 'y' || answer === 'yes') {
            await contentDownloadCommand({ folder, producer, override });
          }

          rl.close();
        });
      }
    }
  });

/**
 * Upload content to the data lake.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli content upload -h
 * ```
 *
 * Examples:
 *
 * Single file:
 *
 * ```sh
 * $ eubfr-cli content upload .content/eac/CreativeEurope_Projects_Overview.csv -p eac
 * ```
 *
 * Multiple files:
 *
 * ```sh
 * $ eubfr-cli content upload .content/inforegio/EUBFR_VIEW_16052018.xml .content/inforegio/regio_projects.json -p inforegio
 *```

 * All files:
 *
 * ```sh
 * $ eubfr-cli content upload
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

    console.log('Uploading new content to the data lake ...');

    const missing = ensureVariables(['SIGNED_UPLOADS_API'], endpoints);

    if (missing) {
      console.error(`${missing} environment variable is missing.`);
      process.exit(1);
    }

    let credentials = [];
    const producerIsSet = hasValidOption('producer', options);
    const filesAreSet = files.length !== 0;

    if (!producerIsSet && filesAreSet) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    if (producerIsSet) {
      const { producer } = options;
      credentials = [{ [producer]: await getCredentials(producer) }];
    }

    if (!producerIsSet && !filesAreSet) {
      console.log('All files for all producers will be uploaded.');
      const producers = getAllProducers();

      credentials = await Promise.all(
        producers.map(async producer => {
          const producerCredentials = await getCredentials(producer);
          return {
            [producer]: producerCredentials,
          };
        })
      );
    }

    await contentUploadCommand({ files, credentials, endpoints });
  });

/**
 * Display files of a given producer.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli content show -h
 * ```
 *
 * Examples:
 *
 * Specific file by `computed_key`:
 *
 * ```sh
 * $ eubfr-cli content show eac/16598a36-db86-42a0-8041-c0d85021ad97.csv
 * ```
 *
 * All files of a given producer:
 *
 * ```sh
 * $ eubfr-cli content show -p eac
 * ```
 *
 * Please note that if you are sure there's an existing content,
 * but you can't see it with this command, you'll need to double-check
 * `eubfr-data-lake/demo/dashboard/client/.env` file to contain
 * the correct value for `REACT_APP_STAGE`.
 * If it's not the same as config.json's `stage`, run
 * `eubfr-cli env generate-variables` to refresh the value of `REACT_APP_STAGE`.
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

    console.log('Querying for existing content in the data lake ...');

    const missing = ensureVariables(
      ['REACT_APP_STAGE', 'REACT_APP_ES_PRIVATE_ENDPOINT'],
      endpoints
    );

    if (missing) {
      console.error(`${missing} environment variable is missing.`);
      process.exit(1);
    }

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

    await contentShowCommand({ file, producer, endpoints });
  });

/**
 *
 * Delete files by `computed_key` field.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli content delete -h
 * ```
 *
 * Examples:
 *
 * Delete one or multiple files:
 *
 * ```sh
 * $ eubfr-cli content delete eac/foo cordis/bar inforegio/baz
 * ```
 *
 * Delete all files of all producers:
 *
 * ```sh
 * $ eubfr-cli content delete
 * ```
 *
 * By default, you will be prompted to confirm your intention.
 * You can skip the this prompt by adding `--confirm` flag.
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

    console.log('Deleting content from the data lake ...');

    const missing = ensureVariables(
      ['DELETER_API', 'REACT_APP_STAGE', 'REACT_APP_ES_PRIVATE_ENDPOINT'],
      endpoints
    );

    if (missing) {
      console.error(`${missing} environment variable is missing.`);
      process.exit(1);
    }

    const producers = getAllProducers();

    const credentials = await Promise.all(
      producers.map(async producer => {
        const producerCredentials = await getCredentials(producer);
        return {
          [producer]: producerCredentials,
        };
      })
    );

    if (options.confirm) {
      await contentDeleteCommand({ files, credentials, endpoints });
    } else {
      // Initiate the prompt interface.
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('Are you sure? <yes|y> ', async answer => {
        if (answer === 'y' || answer === 'yes') {
          await contentDeleteCommand({ files, credentials, endpoints });
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
