# Serverless Plugin Elasticsearch Index

[Serverless plugin](https://serverless.com/framework/docs/providers/aws/guide/plugins/)
to automate the creation of elasticsearch indices and mappings on deployment of your services.
In the background it uses [elasticsearch client](https://github.com/elastic/elasticsearch-js).

## Usage

When installed in your service, update your `serverless.yml` file as follows:

### Register the plugin in your service

For example:

```yaml
service: foo-service

plugins:
  - serverless-plugin-elasticsearch-index

  ...
```

Order does not matter, the plugin can be added at any position in the list.

### Configure the plugin

Use the `custom` section in `serverless.yml` to apply settings to the plugin:

```yaml
custom:
  slsEsIndex:
    type: project
    index: projects
    mapping: ${file(./src/mappings/project.js)}
    region: ${opt:region, file(../../../config.json):region, 'eu-central-1'}
    domain: ${file(../elasticsearch/.serverless/stack-output.json):ServiceEndpoint, env:SLS_ES_DOMAIN}

...
```

[Variables](https://serverless.com/framework/docs/providers/aws/guide/variables/)
can be used for extracting values from various parts of the project for your convenience.

As the domain variable depends on a deployed service, it can be passed either
from a file containing the domain address, or from an environment variable `SLS_ES_DOMAIN`.

To export the domain address in a file, you can choose from a variety of plugins:

* [serverless-stack-output](https://github.com/sbstjn/serverless-stack-output)
* [serverless-export-env](https://www.npmjs.com/package/serverless-export-env)

Of course, you can use any other means to get information after CloudFormation has finished a deployment.
