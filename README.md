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

Test the services offline:

```sh
yarn offline
```

## Deploy

First, you need to [set up your AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

Then, go to the folder of the service you want to deploy and type:

```sh
yarn deploy -s [STAGE NAME]
```

For example, it can be: `yarn deploy -s devUser1`.
