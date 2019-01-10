# ETL development

Welcome to this quick guide for setting up a new producer and ETL in the project.

In the end of the guide, you will have a producer is discoverable, deployable and its related documentation will be generated automatically.

## Authenticate to AWS console

The domain used for the project is `digit-b4-eu-results`, thus enter your credentials at https://digit-b4-eu-results.signin.aws.amazon.com/console

## Create the ETL

Locally create a folder `/services/ingestion/etl/PRODUCER_NAME/FILE_FORMAT`.
Do not hesitate to look at existing ETLs for examples.

## Create a Producer user

Through the [AWS IAM service dashboard](https://console.aws.amazon.com/iam/home?region=eu-central-1#/home), create a new user with `PRODUCER_NAME` and assign it the `"Producers"` group.

Save the user's credentials to your local computer. You will need these temporarily to create a secret which could be reused by other AWS services.

## Create a secret

Go to [AWS Secrets Manager service dashboard](https://eu-central-1.console.aws.amazon.com/secretsmanager/home?region=eu-central-1#/listSecrets) and create a new secret containing the credentials for `PRODUCER_NAME`, the secret name should follow the following convention: `producers/PRODUCER_NAME`.

Please delete the temporarily saved credentials from your computer!

## Make the new producer discoverable

In order for the new producer to be used throughout the project, you'll need to update a few parts of the project.

### Configuration file

Update `config.example.json`. If not a single producer to use has been specified, this is the fallback mechanism which extracts a list of available producers. Check `tools/eubfr-cli/lib/getAllProducers.js` for details.

### Documentation generator

Update the list of ETLs and their corresponding file types in `scripts/documentation/docs-md.js`.

### Service-related utilities

Update `tools/eubfr-cli/lib/getServices.js` which is used on deployment processes. Rarely you will need to set `exportEnv` flag on ETLs, though please double-check whether you will need the new producer to export variables on export.
