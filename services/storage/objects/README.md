# Storage - Objects service

This service creates the S3 bucket `eubfr-${self:provider.stage}` and forwards the event `s3:ObjectCreated:*` to the SNS topic `${self:provider.stage}-object-created`.
