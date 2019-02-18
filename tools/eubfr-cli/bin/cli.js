#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

/**
 * EUBFR CLI
 *
 * Low-level utilities for managing assets of EUBFR data lake.
 *
 * Please refer to [Getting Started guide](./docs/GETTING_STARTED.md) before jumping into using the utility.
 *
 * Each command and sub-command has a help menu, which you can open by passing `-h` or `--help` flags without any arguments.
 *
 * ### Usage
 *
 * ```sh
 * $ eubfr-cli -h
 * ```
 *
 * @name Introduction
 * @public
 */
program.version(pkg.version).usage('[resource] [action]');

/**
 * Manage resources
 *
 * ### Usage
 *
 * ```sh
 * $ eubfr-cli resources -h
 * ```
 *
 * @name Resources
 * @public
 */
program.command('resources', 'Resources management');

/**
 * Manage services
 *
 * ### Usage
 *
 * ```sh
 * $ eubfr-cli services -h
 * ```
 *
 * @name Services
 * @public
 */
program.command('services', 'Services management');

/**
 * Manage demo applications
 *
 * ### Usage
 *
 * ```sh
 * $ eubfr-cli demo -h
 * ```
 *
 * @name Demo
 * @public
 */
program.command('demo', 'Demo applications management');

/**
 *
 * Manage content
 *
 * ### Usage
 *
 * ```sh
 * $ eubfr-cli content -h
 * ```
 *
 * ### Notes
 *
 * The [eubfr-content](https://s3.console.aws.amazon.com/s3/buckets/eubfr-content/?region=eu-central-1&tab=overview) S3 bucket is a central content repository which holds files which could be ingested by the data lake.
 *
 * Content is a core resource for the data lake, and although it's not required to have it while working with the project, it's highly recommended that you have a local copy to work faster.
 *
 * You can clone the content repository locally in several ways:
 *
 * With the AWS CLI:
 *
 * ```sh
 * $ mkdir .content && aws s3 sync s3://eubfr-content ./.content
 * ```
 *
 * With the EUBFR CLI:
 *
 * ```sh
 * $ eubfr-cli content download --confirm
 * ```
 *
 * With the Yarn CLI (abstracted commands to EUBFR CLI)
 *
 * ```sh
 * $ yarn content:download
 * ```
 *
 * To see more abstracted project-level operations related to content:
 *
 * ```sh
 * $ yarn run | grep content
 * ```
 *
 * @name Content
 * @public
 */
program.command('content', 'Content management');

/**
 * Manage environment
 *
 * ### Usage
 *
 * ```sh
 * $ eubfr-cli env -h
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
 * $ eubfr-cli es -h
 * ```
 *
 * @name Elasticsearch
 * @public
 */

program.command('es', 'Elasticsearch management');

// If no arguments provided, display help menu.
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
