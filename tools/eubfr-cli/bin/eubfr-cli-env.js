#!/usr/bin/env node

const program = require('commander');

// Commands
const generateEnvironmentVariables = require('../commands/env/generateVariables');

/**
 * Generate all necessary `.env` files for using the CLI.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli env generate-variables
 * ```
 * @memberof Environment
 * @name GenerateVariables
 * @public
 */
program
  .command('generate-variables')
  .description('Generate all necessary .env files for using the CLI.')
  .action(() => generateEnvironmentVariables());

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
