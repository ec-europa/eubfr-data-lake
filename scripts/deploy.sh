#!/bin/sh

# Exit the script on any command with non 0 return code
set -e

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy storage first
cd ./services/storage/objects
./node_modules/.bin/serverless deploy -v

# Deploy storage meta index
cd ../meta-index
./node_modules/.bin/serverless deploy -v

# Go to project root
cd ../../..

# Deploy DB
cd ./services/db
./node_modules/.bin/serverless deploy -v

# Go to project root
cd ../..

# Deploy manager
cd ./services/ingestion/store
./node_modules/.bin/serverless deploy -v

# Deploy manager
cd ../manager
./node_modules/.bin/serverless deploy -v

# Deploy ETL
cd ../etl/budg/csv
./node_modules/.bin/serverless deploy -v
