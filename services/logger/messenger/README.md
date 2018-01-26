# Helper "messenger" service

Used when 1 message needs to be pushed to several SNS topics at the same time. For example, when logging a message to logs via `@eubfr/logger-listener` but also updating meta index via `@eubfr/storage-meta-index`.

A potentially good place to store utilities for:

* exporting constants regarding message statuses
* validators for lambda event structure (s3 record, message, etc.)
* extractors of context information (accountId, invokingFunctions, etc.)
