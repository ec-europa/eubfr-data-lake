# Ingestion Dead Letter Queue

This is a simple service which other services can call when they fail because of timeout limitations.

It provides `LambdaFailureQueue` SQS resource which others can queue failures to.

Then, the `onFailure` will process the failures by running the code of the original failing lambda function in another compute service which does not have timeout limitations.

## Service management

The service exports an ARN of `LambdaFailureQueue` which other services [import](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html). Because of this, when you try to delete or update this service, CloudFormation will retain the service and prevent the deletion. This is because several services, such as ETLs, depend on this service.

Thus, please use `yarn delete:services` (and then `yarn deploy:services`) or `yarn delete` delete all related dependencies. Otherwise, code updates in this service will not be taken into account.
