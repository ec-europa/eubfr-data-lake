# Step by step test procedure

If the environment has already been setup, you can skip to [Send data](#send-data)

## Setup your environment

Follow [these instructions](./GETTING_STARTED.md) to start your staged development environment.

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

Follow [these instructions](./GETTING_STARTED.md) to deploy a project under your name and stage.

## Send data

Open the demo dashboard: `http://eubfr-<your_stage_name>-demo-budg-dashboard.s3-website.eu-central-1.amazonaws.com/`.

This page is a demo of what a producer dashboard could provide. From there, upload a test file (CSV, XLS). Then, hit the "Refresh" button to see if your file appears in the meta index.

Now if you want to see the results of the ETL, you can check `http://eubfr-<your_stage_name>-demo-website.s3-website.eu-central-1.amazonaws.com/`. This page lists all the projects for the current stage name.
