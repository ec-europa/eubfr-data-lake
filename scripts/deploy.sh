#!/bin/sh

# Exit the script on any command with non 0 return code
set -e

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy storage first
cd ./services/storage
./node_modules/.bin/serverless deploy -v

# Go to project root
cd ../..

# Deploy DB
cd ./services/db
./node_modules/.bin/serverless deploy -v

# Go to project root
cd ../..

# Deploy manager
cd ./services/ingestion/manager
./node_modules/.bin/serverless deploy -v

# Go to project root
cd ../../..

# Deploy ETL
cd ./services/ingestion/etl/budg/csv
./node_modules/.bin/serverless deploy -v

# Go to project root
cd ../../../../..

# Deploy DB service
cd ./services/db
./node_modules/.bin/serverless deploy -v
