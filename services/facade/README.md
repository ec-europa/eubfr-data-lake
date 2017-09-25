# Facade service

## Introduction

It contains 2 specifications:
- `serverless` contains a [Cloud Formation](https://aws.amazon.com/cloudformation/aws-cloudformation-templates/) configurations
- `swagger.yaml` is an OpenAPI specification which conforms to the v2, also known as swagger and thus the name

### `EUBFRs3ProxyRole` role

The `EUBFRs3ProxyRole` resource follows both allow and trust policies. Read more:
- http://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html
- https://serverless.com/framework/docs/providers/aws/guide/iam/
- https://forum.serverless.com/t/its-possible-to-create-trust-policy-document-with-serverless/1171/7

### Authorization and authentication

When generating an API key for clients, do not forget to connect the key to a usage plan in the [API Gateway](https://aws.amazon.com/blogs/aws/new-usage-plans-for-amazon-api-gateway/) Console.

`AuthorizationType` for the root method is currently set to none, but could be extended to either an IAM-specific mechanisms or a custom authorizer.
Read more:
- http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-use-postman-to-call-api.html
- http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html
