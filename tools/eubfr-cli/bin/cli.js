#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

/**
 * EUBFR CLI
 *
 * Low-level utilities for managing assets of EUBFR data lake.
 *
 * ### Usage
 *
 * ```sh
 * $ npx eubfr-cli -h
 * ```
 *
 * @name Introduction
 * @public
 */
program.version(pkg.version).usage('[resource] [action]');

/**
 * Manage services
 *
 * ### Usage
 *
 * ```sh
 * $ npx eubfr-cli services -h
 * ```
 *
 * @name Services
 * @public
 */
program.command('services', 'Services management');

/**
 * Manage environment
 *
 * ### Usage
 *
 * ```sh
 * $ npx eubfr-cli env -h
 * ```
 *
 * @name Environment
 * @public
 */
program.command('env', 'Environment management');

/**
 * Manage Elasticsearch assets
 *
 * ### Usage
 *
 * ```sh
 * $ npx eubfr-cli es -h
 * ```
 *
 * @name Elasticsearch
 * @public
 */

program.command('es', 'Elasticsearch management');

// The following comment contains `tree` results which cause lintint issues.
/* eslint-disable no-irregular-whitespace */
/**
 *
 * Manage content
 *
 * ### Usage
 *
 * ```sh
 * $ npx eubfr-cli content -h
 * ```
 *
 * ### Notes
 *
 * If you want to make use of the CLI to automatically upload or delete all content of a given stage, you can optionally create a `.content` folder in the root of your project, with the following example structure:
 *
 * ```
 * .
 * ├── agri
 * │   └── agri_history.csv
 * ├── budg
 * │   └── CreativeEurope_Projects_Overview_2017-08-21.xls
 * ├── iati
 * │   └── activity.csv
 * ├── inforegio
 * │   ├── EUBFR_VIEW_16052018.xml
 * │   └── regio_projects.json
 * ├── valor
 * │   └── valor_sample.xls
 * └── wifi4eu
 *     └── wifi4euRegistrations.xlsx
 * ```
 *
 * There are 2 abstracted operations on a project level:
 *
 * - `yarn content:upload` uploads files from `.content` producers' folders to their respective S3 buckets in the cloud. This triggers the ingestion process.
 * - `yarn content:delete` deletes all the currently uploaded content of all producers, for a given stage.
 *
 * You will need to have the `config.json` file correctly setup in the root folder of the project, as producers' credentials are currently stored only there in the existing workflows.
 *
 * @name Content
 * @public
 */
/* eslint-enable no-irregular-whitespace */
program.command('content', 'Content management');

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
