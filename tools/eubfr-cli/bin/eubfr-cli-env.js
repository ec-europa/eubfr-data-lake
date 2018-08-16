#!/usr/bin/env node

const program = require('commander');

// Commands
const generateEnvironmentVariables = require('../commands/env/generateVariables');

/**
 * That's probably the first operation you'd like to execute before using the EUBFR CLI.
 *
 * The command will generate `.env` files for all services which contain variable exports which are necessary for the proper functioning of the CLI.
 *
 * For instance, you may try to get information about available Elasticsearch domains which are manageable by the CLI running `npx eubfr-cli es`.
 *
 * If you haven't deployed `@eubfr/demo-dashboard-client` or you have switched between staging environments working on different branches at the same code base, then you'll get an error like this:
 *
 * ```
 * ENOENT: no such file or directory, open '.../eubfr-data-lake/demo/dashboard/client/.env'
 * ```
 *
 * Or it could be also any other message that hints for a requirement of a given named environment variable, such as `SIGNED_UPLOADS_API`.
 *
 * These are signs that you need to re-generate all necessary `.env` files which contain information about the API endpoints.
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli env generate-variables
 * ```
 *
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
