# Getting started

## Requirements

- Node.js (8.10.x recommended)
- yarn >= 1.x

Please note that some functionalities of `serverless` do not work properly in higher versions. For example, deploy function will show you an error of hanging connection. Using version 8 of Node.js will prevent unexpected issues of that sort.

### Setup

In order to get the CLI utility to work properly, you will need to first setup your EUBFR development environment correctly.

When you have the EUBFR project cloned to your development machine, run:

```sh
yarn
```

This will download and symlink all necessary dependencies.

Then, if you haven't done so, copy `config.example.json` to `config.json` and set the values according to your environment. Note that `stage` can only contain alphanumeric characters.

The CLI will read this configuration file to know which AWS environment you want to manage (i.e. `stage` property) and also get the necessary producers' credentials wherever and whenever necessary. (from `demo`)

### Usage

There are several ways by which you can use the CLI, the most common are:

1.  Invoking the binary from the development environment

This means you can either do that:

```sh
$ ./node_modules/.bin/eubfr-cli
```

or

```sh
$ npx eubfr-cli
```

The [npx](https://www.npmjs.com/package/npx) is a helper coming automatically with the version of node and npm.

2.  Using the CLI from the global scope

If you install the `@eubfr/cli` package globally, you won't need to add information about the path to the binary, but just run

```sh
$ eubfr-cli
```

You can "browse" available commands and sub-commands by passing `-h` or `--help` flag on each level, for example:

```sh
$ npx eubfr-cli -h
```

Will show you that you can work on services and resources, then if you want to go deeper and manage services specifically, you can do:

```sh
$ npx eubfr-cli services -h
```

Which will show you commands options specifically for this type of CLI manageable resource.

Further, if you want to deploy a service, but you don't know the available options, you can also do:

```sh
$ npx eubfr-cli services deploy -h
```

### Workflows

The list of commands available in the EUBFR CLI is ordered by the priority of importance of actions you would normally need to take to work with the EUBFR project in overall.

More specifically:

- `resources`: related to managing AWS resources in terms of EUBFR resources: raw and harmonized storage buckets, etc. These are important to deploy and create first on AWS, as services, such as ETLs rely on the existance of the harmonized storage bucket in order to store the results of transformations.
- `services`: related to managing serverless services of the EUBFR project. These are shorthand commands such as `deploy` and `delete` which you'd normally do by, for example changing to the directory of a given service by `cd ./services/ingestion/etl/agri/csv/` and then either deploying `yarn deploy` or removing a service from the AWS console, i.e. `npx sls remove --stage chernka202 --region eu-central-1`. While working on a specific ETL, for example, instead of changing between directories and using different CLIs such as `yarn`, `sls` and `eubfr-cli`, simply use only the `eubfr-cli`.
- `env`: related to managing environment variables and other general project environment assets. Sometimes, when a given service such as the `@eubfr/storage-signed-uploads` service has already been deployed, but its `.env` file is either deprecated or incorrect. You can re-generate this data from the AWS with commands of `eubfr-cli env`.
- `es`: related to managing assets and resources of Amazon Elasticsearch. This service being an Amazon abstraction on top of the Elastic's Elasticsearch, there are many specifics about authentication and inter-service permissions and policies you wouldn't normally want to handle every time you want to back up data or manage domains and indices of Elasticsearch. The command helps with that.
- `content`: related to managing the content in the EUBFR data lake. Since content management is very producer-oriented task, you'd normally almost always use the `-p` or `--producer` flag to specify whoose content you want to manage specifically.

Please refer to the [main documentation](../README.md) for further details and examples for each available command.
