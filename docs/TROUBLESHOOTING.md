# Troubleshooting

This section contains a list of known issues and suggestions on how to solve them.

## CloudFormation cannot update a stack when a custom-named resource requires replacing

Elasticsearch resource is defined in `serverless.yml` file build and deployed via CloudFormation. For time and resource savings, serverless microservices depending on the Elasticsearch domains manage their data in per-index fashion. This means that when you develop a stage such as `kc266` for a ticket EUBFR-266, a few indices are to be created: `kc266-projects`, `kc266-quality-reports` (in public) and `kc266-meta` and `kc266-logs` (in private).

Aiming for simplicity, the creation of these indices is first attempted during `deploy:resources` command on deploy hook in serverless.

There are potentially 2 approaches of solving the issue:

1. Retrying

You can retry the deployment from the resource itself:

```sh
$ pwd # Outputs /home/kalata/Projects/@ec/@eubfr/eubfr-data-lake/resources/elasticsearch

$ yarn deploy # Prints deployment progress
```

If the index creation fails consistently with a similar message

```
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
CloudFormation - UPDATE_IN_PROGRESS - AWS::CloudFormation::Stack - resources-elasticsearch-dev
CloudFormation - UPDATE_FAILED - AWS::Elasticsearch::Domain - PublicElasticSearchDomain
CloudFormation - UPDATE_FAILED - AWS::Elasticsearch::Domain - PrivateElasticSearchDomain
CloudFormation - UPDATE_ROLLBACK_IN_PROGRESS - AWS::CloudFormation::Stack - resources-elasticsearch-dev
CloudFormation - UPDATE_COMPLETE - AWS::Elasticsearch::Domain - PublicElasticSearchDomain
CloudFormation - UPDATE_COMPLETE - AWS::Elasticsearch::Domain - PrivateElasticSearchDomain
CloudFormation - UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS - AWS::CloudFormation::Stack - resources-elasticsearch-dev
CloudFormation - UPDATE_ROLLBACK_COMPLETE - AWS::CloudFormation::Stack - resources-elasticsearch-dev
Serverless: Operation failed!
```

This means that you will need to create indices manually. This is possible with the [EUBFR CLI](https://github.com/ec-europa/eubfr-data-lake/tree/master/tools/eubfr-cli#createindex)

Gets information about the environment:

```sh
$ yarn eubfr-cli env generate
```

Create index:

```sh
$ yarn eubfr-cli es create-index kc266-projects -t project -m ./resources/elasticsearch/mappings/project.js -d REACT_APP_ES_PUBLIC_ENDPOINT # Creates the index
```

Repeat this flow for the rest:

```sh
$ yarn eubfr-cli es create-index kc266-quality-reports -t report -m ./resources/elasticsearch/mappings/quality-report.js -d REACT_APP_ES_PUBLIC_ENDPOINT

$ yarn eubfr-cli es create-index kc266-meta -t file -m ./resources/elasticsearch/mappings/meta.js -d REACT_APP_ES_PRIVATE_ENDPOINT

$ yarn eubfr-cli es create-index kc266-logs -t file -m ./resources/elasticsearch/mappings/logs.js -d REACT_APP_ES_PRIVATE_ENDPOINT
```
