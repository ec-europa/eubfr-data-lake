# Pushing information to EUBFR data lake

This is a high-level guide explaining the low-level approach of ingesting data programatically. Because the work will be done through the HTTP protocol via RESTful service requests, you can either use the same tools as described here, or use any other tool-chain that work with the protocol and is more convenient for you.

## Getting credentials

To receive AWS access key id and secret, please contact EUBFR PM. These credentials will be provided privately.

For `x-amz-meta-producer-key` request header, user the name of your producer in the system - i.e. `agri`, `budg`, `inforegio`.

## Getting information about service endpoints

The service which manages the first step of the ingestion - the upload of information - is managed by the `@eubfr/storage-signed-uploads` service. We follow the [signature version 4 signing process](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) which gives producers a secured temporary access to AWS resources.

Endpoints for producers are issued by case-by-case scenarios. When the data lake is ready to ingest your data, as a producer, you will receive a set of endpoints for ingestion-related operations.

For example, given a root endpoint `API` being `https://ti5rsoocwg.execute-api.eu-central-1.amazonaws.com/test/storage`, the following endpoints will be available for you:

| Operation | Endpoint           |
| --------- | ------------------ |
| Upload    | {`API`}/signed_url |
| Download  | {`API`}/download   |
| Update    | {`API`}/update     |

The example root endpoint may change in time. Please request this information when you make your implementation. Later, you will be notified each time there is a change in address.

## Uploading data

In order to upload new data, you will need to start from the `signed_url` endpoint which will provide a signed URL with temporary permissions to add new data file to the AWS S3 bucket. This bucket will later by processed further automatically.

![Getting a signed upload URL](./assets/signed-upload-flow.gif)
