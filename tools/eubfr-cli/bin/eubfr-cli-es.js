#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const readline = require('readline');

// Utilities
const getEndpoints = require('../lib/getEndpoints');
const hasValidOption = require('../lib/hasValidOption');

// Commands
const showCluster = require('../commands/es/showCluster');
const showDomains = require('../commands/es/showDomains');
const showIndices = require('../commands/es/showIndices');
const createIndex = require('../commands/es/createIndex');
const deleteIndices = require('../commands/es/deleteIndices');

const missingRequiredInput = '\n error: Missing required input parameters';

/**
 * Display a list of manageable domains.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli es show-domains
 * ```
 * @memberof Elasticsearch
 * @name showDomains
 * @public
 */
program
  .command('show-domains')
  .description('Display a list of manageable domains.')
  .action(() => showDomains(getEndpoints()));

/**
 * Display cluster information about a given domain.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli es show-cluster
 * ```
 * @memberof Elasticsearch
 * @name showCluster
 * @public
 */
program
  .command('show-cluster')
  .description('Display cluster information about a given domain.')
  .option('-d, --domain [domain]', 'Select a domain.')
  .action(async options => {
    if (!hasValidOption('domain', options)) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    const endpoints = getEndpoints();
    const host = `https://${endpoints[options.domain]}`;

    await showCluster(host);
  });

/**
 * Display index information.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli es show-indices -h
 * ```
 * @memberof Elasticsearch
 * @name showIndices
 * @public
 */
program
  .command('show-indices [indices...]')
  .description('Display index information.')
  .option('-d, --domain [domain]', 'Select a domain.')
  .action(async (indices, options) => {
    if (!hasValidOption('domain', options)) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    const endpoints = getEndpoints();
    const host = `https://${endpoints[options.domain]}`;

    await showIndices({ indices, host });
  });

/**
 * Create an index in a given domain with an optional mapping.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli es create-index -h
 * ```
 * @memberof Elasticsearch
 * @name createIndex
 * @public
 */
program
  .command('create-index <index>')
  .description('Create an index in a given domain with an optional mapping.')
  .option('-d, --domain [domain]', 'Select a domain.')
  .option('-m, --mapping [mapping]', 'Optional mapping.')
  .option('-t, --type [type]', 'Required if mapping is set.')
  .action(async (index, options) => {
    if (!hasValidOption('domain', options)) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    const mappingPath =
      hasValidOption('mapping', options) && path.resolve(options.mapping);

    const typeProvided = hasValidOption('type', options);

    if (typeProvided && mappingPath === false) {
      console.error(
        `Please provide correct path to mapping document for ${
          options.type
        } type.`
      );
      process.exit(1);
    }

    if (!typeProvided && mappingPath) {
      console.error(`Please provide type option for ${mappingPath} mapping.`);
      process.exit(1);
    }

    // It's optional
    let mapping = {};
    const getMapping = mappingPath
      ? // eslint-disable-next-line
        require(path.resolve(options.mapping))
      : false;

    // Mapping modules return functions returning mapping documents
    if (typeof getMapping === 'function') {
      mapping = getMapping();
      if (!mapping.mappings) {
        console.error(
          'Mapping module has been resolved correctly, but it is malformed. Please ensure that the function exports provides an object with a property `mappings` holing the actual document describing the mapping.'
        );
        process.exit(1);
      }
    }

    const endpoints = getEndpoints();
    const { domain, type } = options;
    const host = `https://${endpoints[domain]}`;

    await createIndex({ index, mapping, type, host });
  });

/**
 * Delete indices from a given Elasticsearch domain.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli es delete-indices -h
 * ```
 * @memberof Elasticsearch
 * @name deleteIndices
 * @public
 */
program
  .command('delete-indices [indices...]')
  .description('Delete indices from a given Elasticsearch domain.')
  .option('-d, --domain [domain]', 'Select a domain.')
  .option('-c, --confirm [confirm]', 'Skip confirmation question.')
  .action(async (indices, options) => {
    if (!hasValidOption('domain', options)) {
      console.error(missingRequiredInput);
      process.exit(1);
    }

    const endpoints = getEndpoints();
    const host = `https://${endpoints[options.domain]}`;

    if (options.confirm) {
      await deleteIndices({ indices, host });
    } else {
      // Initiate the prompt interface.
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('Are you sure? <yes|y> ', async answer => {
        if (answer === 'y' || answer === 'yes') {
          await deleteIndices({ indices, host });
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
