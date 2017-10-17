# EU Budget for Results - Data Lake [![Build Status](https://drone.ne-dev.eu/api/badges/ec-europa/eubfr-data-lake/status.svg)](https://drone.ne-dev.eu/ec-europa/eubfr-data-lake)

## Requirements

-   Node.js current (8.x)
-   yarn >= 1.0.1

We recommend you to use [Node Version Manager](https://github.com/creationix/nvm) with our local `.nvmrc`:

```sh
# Install node version corresponding to the one defined in .nvmrc
# Use '--reinstall-packages-from=node' if you want to migrate npm packages from a previous version
nvm install

# Use the newly installed version
nvm use
```

## Getting started

Setup your environment:

```sh
yarn
```

## Configuration

Copy `config.example.json` to `config.json` and set the values according to your environment.

Note: `stage` can only contain alphanumeric characters.

## Test

Test the services:

```sh
yarn test
```

## Deploy the services

First, you need to [set up your AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

### All at once

Go to the project's root and type:

```sh
yarn deploy
```

### Manually

Go to the folder of the service you want to deploy and type:

```sh
yarn deploy
```

## Deploy the demo

First, make sure you have deployed the services. Then, update your `config.json` with the API Gateway IDs generated during the deployment of the services.

Finally:

```sh
yarn deploy-demo
```

## Notes

-   Deploy `services/storage` first.
-   Keep the same stage name for every services so they can work together.
