# Helper "messenger" module

Used when 1 message needs to be pushed to several SNS topics at the same time. For example, when logging a message to logs via `@eubfr/logger-listener` but also updating meta index via `@eubfr/storage-meta-index`.

A potentially good place to store utilities for:

* exporting constants regarding message statuses
* validators for lambda event structure (s3 record, message, etc.)
* extractors of context information (accountId, invokingFunctions, etc.)

## Usage

This module is only a helper at the moment, it's independent from `serverless` framework. All environment variables are inherited from callee lambda function.

```javascript
import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';

// Context comes from the lambda function.
const messenger = MessengerFactory.Create({ context });

await messenger.send({
  message: {
    computed_key: computedObjectKey,
    status_message: 'File uploaded. Forwarding to the right ETL...',
    status_code: STATUS.UPLOADED,
    // this property flags direct insert in ES index
    persist: {
      type: 'file',
      body: item,
      in: ['meta'],
    },
  },
  to: ['logs'],
});
```

Sending a message to several subscribers in one operation can be achieved as follows:

```javascript
await messenger.send({
  message: {
    computed_key: computedObjectKey,
    status_code: STATUS.ERROR,
    status_message: `Unable to ping ETL "${producer}-${extension}".`,
  },
  to: ['logs', 'meta'],
});
```
