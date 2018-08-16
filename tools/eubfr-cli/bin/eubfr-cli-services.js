#!/usr/bin/env node

const program = require('commander');

// Utilities
const hasValidOption = require('../lib/hasValidOption');

// Commands
const deployServices = require('../commands/services/deployServices');

/**
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli services deploy -h
 * ```
 * Examples:
 *
 * Deploy all services for all producers.
 *
 * ```sh
 * $ npx eubfr-cli services deploy
 * ```
 *
 * Deploy all services, only for working with the AGRI producer
 *
 * ```sh
 * $ npx eubfr-cli services deploy -p agri
 * ```
 *
 * (Re-)Deploy only a set of services for working a given producer
 *
 * ```sh
 * $ npx eubfr-cli services deploy foo bar -p agri
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

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
