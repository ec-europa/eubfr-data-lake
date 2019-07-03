#!/usr/bin/env node

const program = require('commander');

// Utilities
const hasValidOption = require('../lib/hasValidOption');
const shouldProtectStage = require('../lib/shouldProtectStage');

// Commands
const dashboardDeleteCommand = require('../commands/dashboard/delete');
const dashboardDeployCommand = require('../commands/dashboard/deploy');

/**
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli dashboard deploy -h
 * ```
 *
 * Examples:
 *
 * Deploy dashboard.
 *
 * ```sh
 * $ eubfr-cli dashboard deploy
 * ```
 *
 * Deploy all services, only for working with the EAC producer.
 *
 * ```sh
 * $ eubfr-cli dashboard deploy
 * ```
 *
 * @memberof Dashboard
 * @name Deploy
 * @public
 */
program
  .command('deploy')
  .description('Deploy dashboard.')
  .action(async () => {
    await dashboardDeployCommand();
  });

/**
 *
 * Remove dashboard.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli dashboard delete -h
 * ```
 *
 * Examples:
 *
 * Delete the applications.
 *
 * ```sh
 * $ eubfr-cli dashboard delete
 * ```
 *
 * @memberof Dashboard
 * @name Delete
 * @public
 */
program
  .command('delete')
  .description('Delete the applications.')
  .action(async () => {
    if (shouldProtectStage()) {
      console.log('You are on a protected stage!');
      process.exit();
    }

    await dashboardDeleteCommand();
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
