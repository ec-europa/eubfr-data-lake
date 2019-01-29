# Environment variables

In the following guide, you will find detailed information about how to use environment variables to manage a given staging environment.

In order to reuse AWS resources and keep complexity levels low, each developer works within a contained environment called stage. After work has been approved, changes are merged to upstream master. Then the master gets deployed to a set of fixed stages: `test`, acting as staging before production, and `prod`.

## See current state

In order to inspect the current values of the environment variables you'll be working with, run the following command:

```sh
$ eubfr-cli env print
```

## Logs

Use `VERBOSE` flag to inspect values of the environment variables used by the CLI when you run a specific command.

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
export EUBFR_AWS_REGION=eu-central-1
export EUBFR_USERNAME=cordis
export EUBFR_CONTENT_REPOSITORY=eubfr-content
```

Please keep in mind that setting `EUBFR_USERNAME` will force EUBFR CLI to work only with assets related to this particular producer. This way, running deployment scripts, you'll get a working environment faster for CORIS, leaving out AGRI, HOME, etc.

## Management

Here's a list of settings separated by their target goals:

### Content management

When you work on a specific ETL and you want to save time from repetitive creation and deletion of content to test how you changes reflect online.

#### Download

If you want to download all the files which are ready to be ingested in the data lake, you will need to set the S3 bucket serving the purpose of the content repository:

```sh
export EUBFR_CONTENT_REPOSITORY=eubfr-content
```

#### Upload

For content upload to work, the following variables are required:

```sh
export SIGNED_UPLOADS_API={service-id}.execute-api.eu-central-1.amazonaws.com/{eubfr-stage-value}
```

The value for `SIGNED_UPLOADS_API` can be taken once `@eubfr/storage-signed-uploads` has been deployed.

If the service is already deployed and does not need re-deployment, i.e. existing `test` and `prod` stages, go to [AWS Lambda web console](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions) and search for `{eubfr-stage-value}-storage-signed-uploads-upsert-objects`. Get the necessary environment variable by clicking on the function and scrolling down to its `Environment variables` section.

#### Show existing content

To query and see existing content, the following variables are required:

```sh
export REACT_APP_STAGE=chernka123
export REACT_APP_ES_PRIVATE_ENDPOINT=search-{eubfr-stage-value}-private-{service-id}.eu-central-1.es.amazonaws.com
```

`REACT_APP_STAGE` is the same as `EUBFR_STAGE`. EUBFR CLI will discover your stage from any of the two if set.

The value for `REACT_APP_ES_PRIVATE_ENDPOINT` can be found from the [AWS Elasticsearch web console](https://eu-central-1.console.aws.amazon.com/es/home?region=eu-central-1#) and selecting the right `{eubfr-stage-value}-private` domain.

For example, if you are working on `dev`, you would select `dev-private` and find the value for `Endpoint`. Take the value of `https://search-dev-private-{service-id}.eu-central-1.es.amazonaws.com` and strip the protocol prefix.

#### Delete content

To delete content, the following variables are required:

```sh
export DELETER_API={service-id}.execute-api.eu-central-1.amazonaws.com/{eubfr-stage-value}
export REACT_APP_STAGE=chernka123
export REACT_APP_ES_PRIVATE_ENDPOINT=search-{eubfr-stage-value}-private-{service-id}.eu-central-1.es.amazonaws.com
```

The only missing variable which we haven't covered yet in the content management section is the `DELETER_API`. You can follow the same workflow as described above for `SIGNED_UPLOADS_API`. In fact, the `@eubfr/storage-deleter` service is the mirror service to `@eubfr/storage-signed-uploads`.

When you are at the AWS Lambda web console, search for `{eubfr-stage-value}-storage-deleter-delete-objects`. The place for finding the value of the `DELETER_API` will be same as the approach you followed for finding `SIGNED_UPLOADS_API`. The format will also be the same, but with a different `{service-id}`.

### Elasticsearch management

When you want to work with the persistence layer, which is Elasticsearch at the moment, there are a few possible operations. To see the list, run the following:

```sh
$ eubfr-cli es
```

You can start by inspecting current state:

```sh
$ eubfr-cli es show-domains
```

Which will show you the names of the variables together with they current values. Regardless of whether you will be working with the public or the private endpoint, the two variables you will need to know are:

```sh
export REACT_APP_ES_PUBLIC_ENDPOINT=search-{eubfr-stage-value}-public-{service-id}.eu-central-1.es.amazonaws.com
export REACT_APP_ES_PRIVATE_ENDPOINT=search-{eubfr-stage-value}-private-{service-id}.eu-central-1.es.amazonaws.com
```

Please note that if you try to use a given variable like:

```sh
$ eubfr-cli es show-cluster -d REACT_APP_ES_PUBLIC_ENDPOINT
```

And you receive `No living connections` message from Elasticsearch service, this is most probably because you don't have a value set for the endpoint you query for.

To get values for these variables, visit the [AWS Elasticsearch web console](https://eu-central-1.console.aws.amazon.com/es/home?region=eu-central-1#), take `Endpoint`-s and strip the protocol prefixes.
