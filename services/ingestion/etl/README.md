# ETL development

Quick guide of steps to create a new ETL.

## Create the ETL

Create a folder `/services/ingestion/etl/PRODUCER_NAME/FILE_FORMAT`.
Do not hesitate to look at existing ETLs for example.

## Create Producer user

Create an AWS IAM user with PRODUCER_NAME and assign it the "Producers" group.

## Update deploy script

In `/scripts/deploy.sh`, look for the "deploy ETL" section and add the necessary lines.

## Update deploy demo script

In `/scripts/deploy-demo.sh`, look for the "PRODUCER demo" section and add one for your user.

## Update delete script

In `/scripts/delete.js,` add your ETL to the `const services` section.

## Update the config template

In `/config.example.json`, add a template for your new demo user.
