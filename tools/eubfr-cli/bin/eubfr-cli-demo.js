#!/usr/bin/env node

const program = require('commander');

// Utilities
const hasValidOption = require('../lib/hasValidOption');
const shouldProtectStage = require('../lib/shouldProtectStage');

// Commands
const deployDemos = require('../commands/demo/deploy');
const deleteDemos = require('../commands/demo/delete');

/**
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli demo deploy -h
 * ```
 *
 * Examples:
 *
 * Deploy all demo applications for all producers.
 *
 * ```sh
 * $ eubfr-cli demo deploy
 * ```
 *
 * Deploy all services, only for working with the EAC producer.
 *
 * ```sh
 * $ eubfr-cli demo deploy -p eac
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
 * $ eubfr-cli demo delete -h
 * ```
 *
 * Examples:
 *
 * Delete all demo applications.
 *
 * ```sh
 * $ eubfr-cli demo delete
 * ```
 *
 * Delete only demo application of EAC producer.
 *
 * ```sh
 * $ eubfr-cli demo delete -p eac
 * ```
 *
 * @memberof Demo
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

    if (shouldProtectStage()) {
      console.log('You are on a protected stage!');
      process.exit();
    }

    await deleteDemos({ producer });
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
