#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program.version(pkg.version).usage('[resource] [action]');

/**
 * Manage environment
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli env -h
 * ```
 * @name Environment
 * @public
 */
program.command('env', 'Environment management');

/**
 * Manage Elasticsearch assets
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli es -h
 * ```
 * @name Elasticsearch
 * @public
 */

program.command('es', 'Elasticsearch management');

/**
 * Manage content
 *
 * Usage:
 *
 * ```sh
 * $ npx eubfr-cli content -h
 * ```
 * @name Content
 * @public
 */
program.command('content', 'Content management');

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
