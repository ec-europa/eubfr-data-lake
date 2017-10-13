# Step by step test procedure

If the environment has already been setup, you can skip to [Send data](#send-data)

## Setup your environment

Get latest version of eubfr (clone from github)

Copy config.example.json to config.json and set the values according to your environment:

```json
{
  "eubfr_env": "test",
  "region": "eu-central-1",
  "stage": "<username><n>"
}

```

For example:

```json
{
  "eubfr_env": "test",
  "region": "eu-central-1",
  "stage": "chernka3"
}
```

## Get your AWS credentials

See the serverless guide on [setting up your credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

To get an account at the project's AWS namespace, please contact a PM to have an account created for you. You cannot use other AWS accounts created for other projects if you have such.

When you receive your initial credentials for your account related to the project, please do not forget to change your password and enable a MFA following the [best practices](http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html).

Given you have access to the project's namespace in AWS, bear in mind the following regarding your account:
- We use a shared AWS account with several users. Each user has his own stage variable to separate his work.
- [Create an access key](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) for your account to be able to use it programatically.
- Get also your private key, it comes hand in hand with your personal id.

By the end of the process of organizing your account at AWS, you must come up with 2 environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for managing sessions programatically.

In your terminal application, write the following:
- `export AWS_ACCESS_KEY_ID=<your_access_key>`
- `export AWS_SECRET_ACCESS_KEY=<your_secret_key>`

For more information about access key setup, see [this serverless guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

## Deploy

Make sure your local environment meets the [requirements](https://github.com/ec-europa/eubfr-data-lake#requirements)

Make sure your environment is ready
  - `yarn`

Deploy on root
  - go to root of the project
  - `yarn deploy`

Deploy the facade
  - go to 'services/ingestion/facade'
  - `yarn deploy`

It automatically creates everything you need (bucket, database, ...)

## AWS configuration

Environment should be already configured, but to be sure, check that:

- API Gateway is correctly created, with a 'test' step
- Use plan 'TEST' is correctly created, with API step and API key configured

## Send data

Install postman

  - https://www.getpostman.com/
  - also available as chrome app

Add a header to postman

  - `key: x-api-key`
  - `value: <api_key_value>`

Add your data file in postman

  - In 'body' tab, select 'binary'
  - Select the file you want to send


Get API url

  - Go to [AWS console](https://eu-central-1.console.aws.amazon.com/apigateway/home?region=eu-central-1#/apis)
  - Open 'EUBFRs3Proxy' API
  - In 'Steps', select 'test'
  - API url is displayed at screen top


Add target in postman
  - <api_url>/projects?key=<your_file_name>

Note: the file should be correctly formatted

Send the data

  - Select 'PUT', in the list before the target
  - Hit 'Send'

## Check results

- Go to your [S3 bucket](https://s3.console.aws.amazon.com/s3/home?region=eu-central-1), verify that the file has been uploaded.
- Go to your [database](https://eu-central-1.console.aws.amazon.com/dynamodb/home?region=eu-central-1#tables:) and verify fields have been extracted.
