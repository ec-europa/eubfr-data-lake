# Serverless Plugin Elasticsearch Index

[Plugin](https://serverless.com/framework/docs/providers/aws/guide/plugins/)
for the serverless framework, which integrates with [Elasticsearch](https://github.com/elastic/elasticsearch-js).

## Usage

When installed, update your `serverless.yml` file with the following:

### Add the plugin to your service

For example:

```yaml
service: foo-service

plugins:
  - serverless-plugin-elasticsearch-index

  ...
```

Order does not matter, the plugin can be added at any position in the list.

Then, use the `custom` section to configure the plugin parameters:

```yaml
custom:
  slsEsIndex:
    type: project
    index: projects
    mapping: ${file(./src/mappings/project.js)}
    region: ${opt:region, file(../../../config.json):region, 'eu-central-1'}
    domain: ${file(../elasticsearch/.serverless/stack-output.json):ServiceEndpoint, env:SLS_ES_DOMAIN}
```

As you notice, [variables](https://serverless.com/framework/docs/providers/aws/guide/variables/)
can be used for the setup for your convenience.

As the domain variable depends on a deployed service, it can be passed either
from a file containing the domain address, or from an environment variable.

To export the domain address, a possible plugin integration could be the
[serverless-stack-output](https://github.com/sbstjn/serverless-stack-output) or
[serverless-export-env](https://www.npmjs.com/package/serverless-export-env) or
any other means to get information after CloudFormation has finished a deployment.
