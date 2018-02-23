# Getting started

## Requirements

* Node.js current (8.x)
* yarn >= 1.0.1

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

## Deploy an environment

To deploy all necessary resources for a development environment:

```sh
yarn deploy
```

## Deploy the shared resources

Some resources (like ElasticSearch) are shared between all the stages for a same environment (dev, acc, prod). You need to deploy them first if your indexes don't already exists.

```sh
yarn deploy:resources
```

## Deploy the services

First, you need to [set up your AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

### All at once

Go to the project's root and type:

```sh
yarn deploy:services
```

### Manually

Go to the folder of the service you want to deploy and type:

```sh
yarn deploy
```

## Deploy the demos

First, make sure you have deployed the resources and the services. Then, to deploy all the demos at once, you can run:

```sh
yarn deploy:demo
```

On the other hand, if you want to work on the demo client locally, first deploy the demo server and then start the client:

```sh
# Example: AGRI demo

# Deploy the server first
cd ./demo/dashboard/server
EUBFR_USERNAME=agri yarn deploy

# Then start the client locally
cd ../client
EUBFR_USERNAME=agri yarn start
```

If you don't provide the `EUBFR_USERNAME` variable, it will fall back to the producer defined in your `config.json` (`username` field).

## Remove the services and demo apps

To delete all AWS services and resources for a given stage:

```sh
yarn delete
```

You can remove per-resource groups as following:

All resources:

```sh
yarn delete:resources
```

All services:

```sh
yarn delete:services
```

All demo apps:

```sh
yarn delete:demo
```

Or, if you want to target a specific producer demo app:

```sh
EUBFR_USERNAME=budg yarn run delete:demo
```

## Notes

* Deploy `resources/` first.
* Keep the same stage name for every services so they can work together.
