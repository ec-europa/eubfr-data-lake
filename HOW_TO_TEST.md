# Step by step test procedure

## Setup your environment

- Get latest version of eubfr (clone from github)

- Copy config.example.json to config.json and set the values according to your environment:
  - `"region": "eu-central-1"`,
  - `"stage": "test-<your_username>-01`"

## Get your AWS credentials

- see https://serverless.com/framework/docs/providers/aws/guide/credentials/

You mainly need to get your AWS keys and set them up by using:
- `export AWS_ACCESS_KEY_ID=<your_access_key>`
- `export AWS_SECRET_ACCESS_KEY=<your_secret_key>`

## Deploy

- Deploy the facade using 'test' tag
  - go to 'services/ingestion/facade'
  - `EUBFR_ENV=test yarn deploy`

- Deploy on root using 'test' tag:
  - go to root
  - `EUBFR_ENV=test yarn deploy`

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

- Get api url
  - https://04rsp7f5h2.execute-api.eu-central-1.amazonaws.com/test

- Add your data file
  - In 'body' tab, select 'binary'
  - Select the file you want to send
