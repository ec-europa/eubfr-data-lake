# Pushing information to EUBFR data lake

This is a high-level guide explaining the low-level approach of ingesting data programatically. Because the work will be done through the HTTP protocol via RESTful service requests, you can either use the same tools as described here, or use any other tool-chain that work with the protocol and is more convenient for you.

## Getting credentials

To receive AWS access key id and secret, please contact EUBFR PM. These credentials will be provided privately.

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

In headers, you'll need to provide 2 key elements:

* `x-amz-meta-producer-key`: the file which you plan to upload. In the example, we'll be uploading data for AGRI from `agri_history.csv`.
* `AWS Signature` header with producer's credentials. You can [prepare headers natively](https://docs.aws.amazon.com/AmazonS3/latest/dev/RESTAuthentication.html) or use a library.

![Getting a signed upload URL](./assets/signed-upload-flow.gif)

When you get the signed URL, use it with a `PUT` request, attaching a file matching exactly the signed `x-amz-meta-producer-key`.

![Uploading data from a signed URL](./assets/upload-data.gif)

If you have a missing or wrong header keys or if the request validity has expired, you will get a response with a status code and response body describing that. In case of success, the client will receive status code `200`.
