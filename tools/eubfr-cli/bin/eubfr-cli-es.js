#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const readline = require('readline');

// Utilities
const getEndpoints = require('../lib/getEndpoints');
const hasValidOption = require('../lib/hasValidOption');

// Commands
const showCluster = require('../commands/es/showCluster');
const snapshotExec = require('../commands/es/snapshotExec');
const showDomains = require('../commands/es/showDomains');
const showIndices = require('../commands/es/showIndices');
const createIndex = require('../commands/es/createIndex');
const deleteIndices = require('../commands/es/deleteIndices');

const missingRequiredInput = '\n error: Missing required input parameters';

/**
 *
 * Abstracted utility for making use of `snapshot` methods of ES JS SDK
 *
 * Useful for making backups of indices, such as `.kibana`.
 *
 * There are a few good reasons why you would want to use EUBFR CLI:
 *
 *  - it knows how to find and use your AWS credentials automatically.
 *  - it provides useful defaults where necessary: such as working with S3 for storage.
 *  - it knows about specific AWS resources which you shouldn't bother to know: S3 backup bucket name, assumed service role arn, etc.
 *  - it also makes a setup of connecting Amazon ES with AWS JS SDK with `http-aws-es`, so all authentication is handled for you.
 *
 * You could, of course, setup clients and authentication yourself, this command is meant to help you be more productive.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec -h
 * ```
 *
 * Examples:
 *
 * Create a repository:
 *
 * Note that the integration with S3 has been setup, `body` of request is prepared for you.
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec createRepository --host https://es.domain/ --params '{ "repository": "repo_name", "verify": true }'
 * ```
 *
 * Get information about specific repositories:
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec getRepository --host https://es.domain/ --params '{ "repository": "repo_name" }'
 * ```
 *
 * Delete a given repository:
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec deleteRepository --host https://es.domain/ --params '{ "repository": "repo_name" }'
 * ```
 *
 * Verify a given repository:
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec verifyRepository --host https://es.domain/ --params '{ "repository": "repo_name" }'
 * ```
 *
 * Create a snapshot:
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec create --host https://es.domain/ --params '{ "repository": "repo_name", "snapshot": "snap1" }'
 * ```
 *
 * Get a snapshot:
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec get --host https://es.domain/ --params '{ "repository": "repo_name", "snapshot": "snap1" }'
 * ```
 *
 * Get status of a given snapshot:
 *
 * ```sh
 * $ eubfr-cli es snapshot-exec status --host https://es.domain/ --params '{ "repository": "repo_name", "snapshot": "snap1" }'
 * ```
 *
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/6.3/modules-snapshots.html
 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-snapshot-create-6-2
 *
 * @memberof Elasticsearch
 * @name snapshotExec
 * @public
 */
program
  .command('snapshot-exec <method>')
  .description('Abstracted helper for using snapshot methods of ES client.')
  .option('--host [host]', 'Select a host (endpoint) of an ES domain.')
  .option('--params [params]', 'The parameters to pass to the method.')
  .action(async (method, options) => {
    if (!hasValidOption('host', options)) {
      console.error('Please provide useful value for the host option.');
      process.exit(1);
    }

    const { host } = options;
    const params = options.params !== undefined ? options.params : {};

    await snapshotExec({ host, method, params });
  });

/**
 * Display a list of manageable domains.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli es show-domains
 * ```
 *
 * Useful when you want to see the names of the Elasticsearch domains available for management throught the EUBFR CLI.
 * This will give you information about the named environment variables holding information about their corresponding hosts. (API endpoints)
 *
 * @memberof Elasticsearch
 * @name showDomains
 * @public
 */
program
  .command('show-domains')
  .description('Display a list of manageable domains.')
  .action(() => showDomains(getEndpoints()));

/**
 *
 * Display cluster information about a given domain.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli es show-cluster
 * ```
 *
 * Once you have the basic information about the domains you can manage through the CLI.
 *
 * Examples:
 *
 * ```sh
 * $ eubfr-cli es show-cluster -d REACT_APP_ES_PUBLIC_ENDPOINT
 * ```
 *
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
 * $ eubfr-cli es show-indices -h
 * ```
 *
 * This could be useful when you want to query for existing indices so that you either re-use or re-create.
 *
 * Examples:
 *
 * ```sh
 * $ eubfr-cli es show-indices -d REACT_APP_ES_PUBLIC_ENDPOINT
 * ```
 * Since output might be too long to read (and most probably it will be in `dev` stage which is shared between developers), it could help to pipe a `grep` in order to focus on more narrow list.
 *
 * ```sh
 *  $ eubfr-cli es show-indices -d REACT_APP_ES_PUBLIC_ENDPOINT | grep chernka
 * ```
 *
 * This will give you a list of existing indices created by the given user. Then, you can make a more narrow query by specifying an index as following:
 *
 * ```sh
 * $ eubfr-cli es show-indices user-index-1 user-index-2 etc -d REACT_APP_ES_PUBLIC_ENDPOINT
 * ```
 *
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
 * $ eubfr-cli es create-index -h
 * ```
 *
 * Used either when creating a new index with a free structure (no mapping rules) or when creating a new index with specific rules about the document structure.
 *
 * Simply create a new index:
 *
 * ```sh
 * $ eubfr-cli es create-index user-index-1 -d REACT_APP_ES_PUBLIC_ENDPOINT
 * ```
 *
 * Create a new index with mapping:
 *
 * ```sh
 * $ eubfr-cli es create-index user-index-1 -t project -m ./resources/elasticsearch/mappings/project.js -d REACT_APP_ES_PUBLIC_ENDPOINT
 * ```
 *
 * This is especially useful when you want to update mapping for a given index without re-creating the whole domain.
 *
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
 * $ eubfr-cli es delete-indices -h
 * ```
 *
 * This could be useful when you want to change mapping of an index without re-creating the whole domain.
 *
 * ```sh
 * $ eubfr-cli es delete-indices user-index-1 -d REACT_APP_ES_PUBLIC_ENDPOINT
 * ```
 *
 * If you would like to skip the confirmation, you can use the `--confirm` flag:
 *
 * ```sh
 * $ eubfr-cli es delete-indices user-index-1 --confirm -d REACT_APP_ES_PUBLIC_ENDPOINT
 * ```
 *
 * Skipping the `user-index-1` will delete all indices in the given domain, so be extra careful with this command.
 *
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
