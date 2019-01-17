# Environment variables

In the following guide, you will find detailed information about how to use environment variables to manage a given staging environment.

In order to reuse AWS resources and keep complexity levels low, each developer works within a contained environment called stage. After work has been approved, changes are merged to upstream master. Then the master gets deployed to a set of fixed stages: `test`, acting as staging before production, and `prod`.

## Logs

Use `VERBOSE` flag to inspect values of the environment variables used by the CLI.

For instance, if you try to upload content and you start to get warnings, re-run with `VERBOSE=*`, for example:

```sh
$ VERBOSE=* npx eubfr-cli content upload -p agri
```

This will print a screen similar to the following:

```
EUBFR CLI endpoints context:
DELETER_API:
REACT_APP_ES_PRIVATE_ENDPOINT:
SIGNED_UPLOADS_API:
REACT_APP_DEMO_SERVER:
REACT_APP_ES_PUBLIC_ENDPOINT:
```

This example shows you that there are neither `.env` files, nor environment variables set and you need to apply the values you need for the given operation.

## Scope of operations

There are generally two types of operations of interest in the project: deployment and management.

Deployment operation is a basic operation which happens frequently on an atomic level.

Management operations, such as content, resource and service management happen mostly when a developer needs to apply granular control over his working environment while testing his work.

## Basic configurations

Here's a list of the required variables which one should set in order to be able deploy an environment:

```sh
export EUBFR_ENV=dev
export EUBFR_STAGE=chernka123
export EUBFR_USERNAME=cordis
```

Please keep in mind that setting `EUBFR_USERNAME` will force EUBFR CLI to work only with assets related to this particular producer. This way, running deployment scripts, you'll get a working environment faster for CORIS, leaving out AGRI, HOME, etc.

## Management configurations

Here's a list of settings separated by their target goals:

### Content management

When you work on a specific ETL and you want to save time from repetitive creation and deletion of content to test how you changes reflect online.

#### Upload

For content upload to work, the following variable is required:

```sh
export SIGNED_UPLOADS_API={service-id}.execute-api.eu-central-1.amazonaws.com/{eubfr-stage-value}
```

The value for `SIGNED_UPLOADS_API` can be taken once `@eubfr/storage-signed-uploads` has been deployed.

If the service is already deployed and does not need re-deployment, i.e. existing `test` and `prod` stages, go to [AWS Lambda console](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions) and search for `{eubfr-stage-value}-storage-signed-uploads-upsert-objects`. Get the necessary environment variable by clicking on the function and scrolling down to its `Environment variables` section.

===

Show:
REACT_APP_STAGE
REACT_APP_ES_PRIVATE_ENDPOINT

Delete:
DELETER_API
REACT_APP_ES_PRIVATE_ENDPOINT
