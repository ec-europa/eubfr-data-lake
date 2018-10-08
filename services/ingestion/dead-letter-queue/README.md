# Ingestion Dead Letter Queue

This is a simple service which other services can call when they fail because of timeout limitations.

It provides `LambdaFailureQueue` SQS resource which others can queue failures to.

Then, the `processDeadLetters` will process the failures by running the code of the original failing lambda function in another compute service which does not have timeout limitations.
