#!/usr/bin/env node

const program = require('commander');

// Commands
const deployResources = require('../commands/resources/deploy');
const deleteResources = require('../commands/resources/delete');

/**
 *
 * Create all necessary AWS resources, such as S3 buckets for raw and harmonized storages.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli resources deploy
 * ```
 *
 * @memberof Resources
 * @name Deploy
 * @public
 */
program
  .command('deploy')
  .description('Deploy resources.')
  .action(async () => {
    await deployResources();
  });

/**
 *
 * Delete resource services.
 *
 * List: resources-raw-storage, resources-harmonized-storage.
 *
 * Especially useful when usually resources-harmonized-storage will fail on deployment.
 *
 * Usage:
 *
 * ```sh
 * $ eubfr-cli resources delete
 * ```
 *
 * @memberof Resources
 * @name Delete
 * @public
 */
program
  .command('delete')
  .description('Delete resources.')
  .action(async () => {
    await deleteResources();
  });

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
