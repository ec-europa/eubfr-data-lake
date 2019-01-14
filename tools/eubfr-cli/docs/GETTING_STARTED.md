# Getting started

## Requirements

- Node.js (8.10.x recommended)
- yarn >= 1.x

Please note that some functionalities of `serverless` do not work properly in higher versions. For example, deploy function will show you an error of hanging connection. Using version 8 of Node.js will prevent unexpected issues of that sort.

### Setup

In order to get the CLI utility to work properly, you will need to first setup your EUBFR development environment correctly.

When you have the EUBFR project cloned to your development machine, run:

```sh
$ yarn install
```

This will download and link dependencies.

In general, there are 2 ways by which you can manage global settings for the project:

- by a centralized configuration file `config.json`
- by environment variables

If you decide to use a centralized configuration file, make sure to copy `config.example.json` to `config.json` and set the values according to your environment. Note that `stage` can only contain alphanumeric characters. The CLI will read `config.json` file to know which AWS environment you want to manage by properties `config.stage` and `config.username`.

Another option would be to set these settings using environment variables:

```sh
export EUBFR_ENV=dev
export EUBFR_STAGE=chernka123
export EUBFR_AWS_REGION=eu-central-1
export EUBFR_USERNAME=cordis
```

Setting `EUBFR_USERNAME` will tell the EUBFR CLI to work only with assets related to this particular producer. This way, running deployment scripts, you'll get a working environment faster for CORIS, leaving out AGRI, HOME, etc.

Please note that setting a default region to your working environment is required for the project to work properly, and this could be done in several ways:

- Setting the environment variable as pointed out above
- Using the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
- Any other conventional way setting the region either in `~/.aws/credentials` or other similar system-wide place.

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

or, because the project uses yarn, [lerna](https://www.npmjs.com/package/lerna) and [workspaces](https://medium.com/trabe/monorepo-setup-with-lerna-and-yarn-workspaces-5d747d7c0e91) feature, you can also use the CLI as following:

```sh
$ yarn eubfr-cli
```

The main difference between `npx` and `yarn` is that `npx` would download missing dependencies if there are any, which could slower your workflow. Whereas `yarn` makes use of the workspaces feature and optimally finds the CLI binary, regardless of it's relative from execution to physical place in the repository.

2.  Using the CLI from the global scope

If you install the `@eubfr/cli` package globally, you will neither have the need to add information about the path to the binary, nor use a helper utility as `npx` or `yarn`, thus simply running the following:

```sh
$ eubfr-cli
```

From this point on, for simplicity in documentation, no utility will be used in order to give the choice to the user.

You can "browse" available commands and sub-commands by passing `-h` or `--help` flag on each level, for example:

```sh
$ eubfr-cli -h
```

Will show you that you can work on services and resources, then if you want to go deeper and manage services specifically, you can do:

```sh
$ eubfr-cli services -h
```

Which will show you commands options specifically for this type of CLI manageable resource.

Further, if you want to deploy a service, but you don't know the available options, you can also do:

```sh
$ eubfr-cli services deploy -h
```

### Workflows

The list of commands available in the EUBFR CLI is ordered by the priority of importance of actions you would normally need to take to work with the EUBFR project in overall.

```sh
eubfr-cli -h

  Usage: eubfr-cli [resource] [action]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    resources      Resources management
    services       Services management
    demo           Demo applications management
    env            Environment management
    es             Elasticsearch management
    content        Content management
    help [cmd]     display help for [cmd]
```

More specifically:

- `resources`

Related to managing AWS resources in terms of EUBFR resources: raw and harmonized storage buckets, etc. These are important to deploy and create first on AWS, as services, such as ETLs rely on the existance of the harmonized storage bucket in order to store the results of transformations.

- `services`

Related to managing `serverless` services of the EUBFR project. These are shorthand commands such as `deploy` and `delete` which you'd normally do by, for example changing to the directory of a given service by `cd ./services/ingestion/etl/agri/csv/` and then either deploying `yarn deploy` or removing a service from the AWS console, i.e. `npx sls remove --stage {username} --region eu-central-1`. While working on a specific ETL, for example, instead of changing between directories and using different CLIs such as `yarn`, `sls` and `eubfr-cli`, simply use only the `eubfr-cli`.

- `demo`

Demo applications make use of the `services` and add user-friendly UIs to manage content and visualize reports and logs of the data lake.

- `content`

Related to managing the content in the EUBFR data lake. Since content management is very producer-oriented task, you'd normally almost always use the `-p` or `--producer` flag to specify whose content you want to manage specifically. The `eubfr-cli content` is the low level interface of what the user would do in demo dashboards from browsers' UIs.

- `env`

Related to managing environment variables and other general project environment assets. Sometimes, when a given service such as the `@eubfr/storage-signed-uploads` service has already been deployed, but its `.env` file is either deprecated or incorrect. You can re-generate this data from the AWS with commands of `eubfr-cli env`.

- `es`

Related to managing assets and resources of Amazon Elasticsearch. This service being an Amazon abstraction on top of the Elastic's Elasticsearch, there are many specifics about authentication and inter-service permissions and policies you wouldn't normally want to handle every time you want to back up data or manage domains and indices of Elasticsearch. The command helps with that.

Please refer to the [main documentation](../README.md) for further details and examples for each command.
