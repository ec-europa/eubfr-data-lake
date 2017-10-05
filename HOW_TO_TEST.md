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

Firstly, you need to have a AWS account, and a pair of keys associated to it
- we use a shared AWS account, with several users
- once you have your user access, you need to [create your user's access key](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
- that will give you an access key and a private key

Then, you need to setup your pair of keys by typing in a terminal:
- `export AWS_ACCESS_KEY_ID=<your_access_key>`
- `export AWS_SECRET_ACCESS_KEY=<your_secret_key>`

For more information about access key setup, see [this serverless guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

## Deploy

- Make sure your local environment meets the [requirements](https://github.com/ec-europa/eubfr-data-lake#requirements)

- Make sure your environment is ready
  - `yarn`

- Deploy on root
  - go to root of the project
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

- Add your data file in postman
  - In 'body' tab, select 'binary'
  - Select the file you want to send

- Get API url
  - Go to [AWS console](https://eu-central-1.console.aws.amazon.com/apigateway/home?region=eu-central-1#/apis)
  - Open 'EUBFRs3Proxy' API
  - In 'Steps', select 'test'
  - API url is displayed at screen top

- Add target in postman
  - <api_url>/projects?key=<your_file_name>

Note: the file should be correctly formatted

- Send the data
  - Select 'PUT', in the list before the target
  - Hit 'Send'

## Check results

- Go to your [S3 bucket](https://s3.console.aws.amazon.com/s3/home?region=eu-central-1)
  - The file is uploaded

- Go to your [database](https://eu-central-1.console.aws.amazon.com/dynamodb/home?region=eu-central-1#tables:)
  - Fields are extracted
