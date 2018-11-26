#!/usr/bin/env node

const program = require('commander');

// Utilities
const hasValidOption = require('../lib/hasValidOption');

// Commands
const deployDemos = require('../commands/demo/deploy');
const deleteDemos = require('../commands/demo/delete');

/**
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli demo deploy -h
 * ```
 *
 * Examples:
 *
 * Deploy all demo applications for all producers.
 *
 * ```sh
 * $ npx eubfr-cli demo deploy
 * ```
 *
 * Deploy all services, only for working with the AGRI producer.
 *
 * ```sh
 * $ npx eubfr-cli demo deploy -p agri
 * ```
 *
 * @memberof Demo
 * @name Deploy
 * @public
 */
program
  .command('deploy')
  .description('Deploy demo applications.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action(async options => {
    const producer = hasValidOption('producer', options)
      ? options.producer
      : '*';

    await deployDemos({ producer });
  });

/**
 *
 * Remove a demo application.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli demo delete -h
 * ```
 *
 * Examples:
 *
 * Delete all demo applications.
 *
 * ```sh
 * $ npx eubfr-cli demo delete
 * ```
 *
 * Delete only demo application of AGRI producer.
 *
 * ```sh
 * $ npx eubfr-cli demo delete -p agri
 * ```
 *
 * @memberof Services
 * @name Delete
 * @public
 */
program
  .command('delete')
  .description('Delete demo applications.')
  .option('-p, --producer [producer]', "Producer's name.")
  .action(async options => {
    const producer = hasValidOption('producer', options)
      ? options.producer
      : '*';

    await deleteDemos({ producer });
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
