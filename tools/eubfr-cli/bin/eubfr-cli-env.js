#!/usr/bin/env node

const program = require('commander');

// Commands
const generateEnvironmentVariables = require('../commands/env/generateVariables');

/**
 *
 * The EUBFR CLI depends on a few environment variables which point to service API endpoints which are necessary for some commands to work.
 * For example, when you want to use commands related to content upload, the CLI will go to `@eubfr/storage-signed-uploads` service and seek for `SIGNED_UPLOADS_API` stored in `.env` file local to the service.
 * This endpoint is necessary for the CLI and other clients (client-side apps) to upload files to the data lake by signed uploads approach in AWS.
 * For this `.env` file to exist in the service, the serverless service itself has to be deployed on AWS in order for the cloud to generate information about the endpoint resulted out of the resource creation.
 * The `generate-variables` command helps you generate such `.env` files by re-uploading the serverless service (which you normally do by `npx sls deploy` from the folder of the service) and then running an export function. (which you usually do by `npx sls export-env`)
 *
 *
 * There are several services which require information from `.env` files, i.e. environment variables in overall.
 * These `.env` files are normally generated automatically for you when you deploy all services setting up your development environment.
 * However, if you receive an error for a missing environment variable, you can use this command to regenerate information about the necessary variables.
 *
 * For instance, you may try to get information about available Elasticsearch domains which are manageable by the CLI running `eubfr-cli es`.
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
 * $ eubfr-cli env generate-variables
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
