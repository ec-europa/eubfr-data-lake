# Facade service

## Introduction

This service contains:
- `serverless.yml` manifest with [`serverless-offline`](https://github.com/dherault/serverless-offline) definitions
- The `serverless-offline` definitions integrate with native http events as described in [`serverless` framework documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway/)
- `swagger.yaml` is an OpenAPI specification which conforms to the v2, also known as swagger and thus the name
- lambda functions for each API method which can integrate with any AWS services via the `aws-sdk`

### AWS resources

All resources needed for the service are automatically created by the `serverless` framework without any `Resources` overrides.

### Authorization and authentication

When generating an API key for clients, do not forget to connect the key to a usage plan in the [API Gateway](https://aws.amazon.com/blogs/aws/new-usage-plans-for-amazon-api-gateway/) Console.
