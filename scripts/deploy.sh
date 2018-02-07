#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy signed uploads service
cd ./services/storage/signed-uploads
./node_modules/.bin/serverless deploy -v

# Deploy deleter service
cd ../deleter
./node_modules/.bin/serverless deploy -v

# Deploy manager
cd ../../ingestion/manager
./node_modules/.bin/serverless deploy -v

# Deploy cleaner
cd ../cleaner
./node_modules/.bin/serverless deploy -v

# Deploy ETL
cd ../etl/agri/csv
./node_modules/.bin/serverless deploy -v
cd ../../budg/xls
./node_modules/.bin/serverless deploy -v
cd ../../inforegio/json
./node_modules/.bin/serverless deploy -v
cd ../../inforegio/xml
./node_modules/.bin/serverless deploy -v
cd ../../valor/xls
./node_modules/.bin/serverless deploy -v

# Deploy value store - projects' functions
cd ../../../../value-store/projects
./node_modules/.bin/serverless deploy -v

# Deploy logger - listener
cd ../../logger/listener
./node_modules/.bin/serverless deploy -v
