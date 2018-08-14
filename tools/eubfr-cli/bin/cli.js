#!/usr/bin/env node

const program = require('commander');
const readline = require('readline');
const pkg = require('../package.json');

// Utilities
const ensureVariables = require('../lib/ensureVariables');
const getCredentials = require('../lib/getProducerCredentials');
const getEndpoints = require('../lib/getEndpoints');
const getAllProducers = require('../lib/getAllProducers');

// Environment-related
const generateEnvironmentVariables = require('../commands/environment/generateVariables');

// Content-related commands
const uploadFiles = require('../commands/content/upload');
const showFile = require('../commands/content/show');
const deleteFiles = require('../commands/content/delete');

// Elasticsearch-related commands
const showCluster = require('../commands/elasticsearch/showCluster');
const showDomains = require('../commands/elasticsearch/showDomains');
const showIndices = require('../commands/elasticsearch/showIndices');

// If -p or -d, or any other `needle` option is passed
// without an actual value, it will be boolean true
// This helper ensures that `needle` option is something useful.
const hasValidOption = (needle, haystack) =>
  haystack[needle] && typeof haystack[needle] !== 'boolean';

const missingRequiredInput = '\n error: Missing required input parameters';

program.version(pkg.version).usage('[command] [option]');

program
  .command('environment-generate-variables')
  .description('Generates all necessary .env files.')
  .action(() => generateEnvironmentVariables());

program
  .command('content-upload [files...]')
  .description('Uploads content to the data lake.')
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

program
  .command('content-show [file]')
  .description('Displays files of a given producer.')
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

program
  .command('content-delete [files...]')
  .description('Deletes files by computed_key field.')
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

program
  .command('es-domains')
  .description('Shows a list of manageable domains.')
  .action(() => showDomains(getEndpoints()));

program
  .command('es-show-cluster')
  .description('Shows cluster information about a given domain.')
  .option('-d, --domain [domain]', 'Select a domain')
  .action(async options => {
    if (!hasValidOption('domain', options)) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    const endpoints = getEndpoints();
    await showCluster(endpoints, options.domain);
  });

program
  .command('es-show-indices [indices...]')
  .description('Shows index information')
  .option('-d, --domain [domain]', 'Select a domain')
  .action(async (indices, options) => {
    if (!hasValidOption('domain', options)) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    const endpoints = getEndpoints();
    const { domain } = options;

    await showIndices({ indices, endpoints, domain });
  });

program
  .command('es-index-create [index]')
  .description('Creates an index in a given domain with an optional mapping.')
  .option('-d, --domain [domain]')
  .option('-m, --mapping [mapping]')
  .action((index, options) => {});

program
  .command('es-index-delete [indices...]')
  .description('Deletes indices from a given Elasticsearch domain.')
  .option('-d, --domain [domain]', 'Domain from which to delete an index.')
  .option('-c, --confirm [confirm]', 'Flag certainty of an operation.')
  .action((indices, options) => {});

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
