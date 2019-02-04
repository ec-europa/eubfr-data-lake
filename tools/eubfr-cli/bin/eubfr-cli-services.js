#!/usr/bin/env node

const program = require('commander');

// Utilities
const hasValidOption = require('../lib/hasValidOption');
const shouldProtectStage = require('../lib/shouldProtectStage');

// Commands
const deployServices = require('../commands/services/deploy');
const deleteServices = require('../commands/services/delete');

/**
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli services deploy -h
 * ```
 *
 * Examples:
 *
 * Deploy all services for all producers.
 *
 * ```sh
 * $ eubfr-cli services deploy
 * ```
 *
 * Deploy all services, only for working with the EAC producer.
 *
 * ```sh
 * $ eubfr-cli services deploy -p eac
 * ```
 *
 * (Re-)Deploy only a set of services for working a given producer.
 *
 * ```sh
 * $ eubfr-cli services deploy foo bar -p eac
 * ```
 *
 * @memberof Services
 * @name Deploy
 * @public
 */
program
  .command('deploy [services...]')
  .description('Deploy services.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action(async (services, options) => {
    const producer = hasValidOption('producer', options)
      ? options.producer
      : '*';

    await deployServices({ services, producer });
  });

/**
 *
 * Remove a serverless service from AWS cloud.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli services delete -h
 * ```
 *
 * Examples:
 *
 * Delete all services.
 *
 * ```sh
 * $ eubfr-cli services delete
 * ```
 *
 * Delete only a given set of services.
 *
 * ```sh
 * $ eubfr-cli services delete storage-signed-uploads storage-deleter
 * ```
 *
 * @memberof Services
 * @name Delete
 * @public
 */
program
  .command('delete [services...]')
  .description('Delete services.')
  .action(async services => {
    if (shouldProtectStage()) {
      console.log('You are on a protected stage!');
      process.exit();
    }

    await deleteServices({ services });
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
