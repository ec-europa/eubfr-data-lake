# Pushing information to EUBFR data lake

This is a high-level guide explaining the low-level approach of ingesting data programatically. Because the work will be done through the HTTP protocol via RESTful service requests, you can either use the same tools as described here, or use any other tool-chain that work with the protocol and is more convenient for you.

## Getting credentials

To receive AWS access key id and secret, please contact EUBFR PM. These credentials will be provided privately.

## Getting information about service endpoints

All request headers should comply with the [signature version 4 signing process](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) which gives producers a secured temporary access to AWS resources. On top of that, some methods require specific keys to know which specific information is to be managed.

For example, given a root endpoint `API` being `https://ti5rsoocwg.execute-api.eu-central-1.amazonaws.com/test/`, the following endpoints related to storage management of ingestion data:

| #   | Operation                    | Endpoint                   | Method | Headers (on top of AWS signature) |
| --- | ---------------------------- | -------------------------- | ------ | --------------------------------- |
| 1   | Upload                       | {`API`}/storage/signed_url | GET    | `x-amz-meta-producer-key`         |
| 2   | Download                     | {`API`}/storage/download   | GET    | `x-amz-meta-computed-key`         |
| 3   | Update                       | {`API`}/storage/update     | PUT    | -                                 |
| 4   | Delete                       | {`API`}/storage/delete     | GET    | `x-amz-meta-computed-key`         |
| 5   | Get a list of files          | {`API`}/meta-index/list    | GET    | -                                 |
| 6   | Get meta for a specific file | {`API`}/meta-index/file    | GET    | `x-amz-meta-computed-key`         |

The root endpoint ID may change in time. Please request this information when you make your implementation. Later, you will be notified each time there is a change in address.

## Uploading data

In order to upload new data, you will need to start with operation (1) which will provide a signed URL with temporary permissions to add new data file to the AWS S3 bucket. This bucket will later by processed further automatically.

![Getting a signed upload URL](./assets/signed-upload-flow.gif)

When you get the signed URL, use the URL (operation (2)) with `PUT`, attaching a file matching exactly the signed `x-amz-meta-producer-key`.

![Uploading data from a signed URL](./assets/upload-data.gif)

If you have a missing or wrong header keys or if the request validity has expired, you will get a response with a status code and response body describing that. In case of success, the client will receive status code `200`.

## Getting existing data

When you plan to update existing information on the data lake, first you need to see what are the existing files. For this, use the meta index API - operations (5) and (6).

For example, this would be the response for checking the file we uploaded in the previous section:

```json
[
  {
    "metadata": {},
    "content_length": 259051,
    "producer_id": "agri",
    "original_key": "agri_history.csv",
    "content_type": "binary/octet-stream",
    "computed_key": "agri/8e387bde-76b8-426b-afe4-c96d8b360b90.csv",
    "status": "parsed",
    "message": "ETL successful",
    "last_modified": "2018-01-23T12:49:17.000Z"
  }
]
```

## Downloading file with existing data

For downloading the file with existing data for corrections, we'll use operation (2).

![Download file with existing data](./assets/downloading-data.gif)

If you don't provide the correct header, you will get feedback in the response body. Double-check the information from the meta index when in doubt.

## Deleting data

When you would like to delete the file with data, and thus all the information related to it in the data lake, use operation (4).
