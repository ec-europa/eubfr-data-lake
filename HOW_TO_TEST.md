# Step by step test procedure

If the environment has already been setup, you can skip to [Send data](#send-data)

## Setup your environment

- Get latest version of eubfr (clone from github)

- Copy config.example.json to config.json and set the values according to your environment:
  - `"eubfr_env": "test"`
  - `"region": "eu-central-1"`
  - `"stage": "test-<your_username>-1`"

## Get your AWS credentials

- see https://serverless.com/framework/docs/providers/aws/guide/credentials/

You mainly need to get your AWS keys and set them up by using:
- `export AWS_ACCESS_KEY_ID=<your_access_key>`
- `export AWS_SECRET_ACCESS_KEY=<your_secret_key>`

## Deploy

- Make sure your environment is ready
  - `yarn`

- Deploy on root
  - go to root
  - `yarn deploy`

- Deploy the facade
  - go to 'services/ingestion/facade'
  - `yarn deploy`

It automatically creates everything you need (bucket, database, ...)

## AWS configuration

Environment should be already configured, but to be sure, check that:

- API Gateway is correctly created, with a 'test' step
- Use plan 'TEST' is correctly created, with API step and API key configured

## Send data

- Install postman
  - https://www.getpostman.com/
  - also available as chrome app

- Add a header to postman
  - `key: x-api-key`
  - `value: <api_key_value>`

- Get api url from AWS console
  - https://q67lpkp9ld.execute-api.eu-central-1.amazonaws.com/test

- Add your data file
  - In 'body' tab, select 'binary'
  - Select the file you want to send

- Add target
  - https://q67lpkp9ld.execute-api.eu-central-1.amazonaws.com/test/projects?key=<your_file_name>

Note: the file should be correctly formatted

- Send the data
  - Select 'PUT', in the list before the target
  - Hit 'Send'

## Check results

- Go to your [S3 bucket](https://s3.console.aws.amazon.com/s3/home?region=eu-central-1)
  - The file is uploaded

- Go to your [database](https://eu-central-1.console.aws.amazon.com/dynamodb/home?region=eu-central-1#tables:)
  - Fields are extracted
