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
    endpointName: ${self:custom.eubfrEnvironment}:resources-elasticsearch:ProjectsEndpoint

...
```

[Variables](https://serverless.com/framework/docs/providers/aws/guide/variables/)
can be used for extracting values from various parts of the project for your convenience.

As the elasticsearch domain endpoint address depends on a deployed service, thus
the evaluated expression should match an export from CloudFormation from an existing stack.
This basically means that the [`ListExports`](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListExports.html).

### Export domain address

From the service which creates the elasticsearch domain in AWS, add an export in the end of `serverless.yml`

```yaml
Outputs:
  ProjectsEndpoint:
    Description: The API endpoint of elasticsearch domain.
    Value:
      Fn::GetAtt: ["ProjectsElasticSearchDomain", "DomainEndpoint"]
    Export:
      # Global varibale, uses eubfrEnvironment instead of stage
      Name: "${self:custom.eubfrEnvironment}:${self:service}:ProjectsEndpoint"
```

By adding this export, other plugins such as [serverless-stack-output](https://github.com/sbstjn/serverless-stack-output)
can hook into the creation phase of the CloudFormation stack and create a file with the information for other
services and modules to feed in the information about the domain address.
