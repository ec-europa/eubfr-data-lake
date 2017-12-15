#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy storage first
cd ./services/storage/objects
./node_modules/.bin/serverless deploy -v

# Deploy signed uploads service
cd ../../storage/signed-uploads
./node_modules/.bin/serverless deploy -v

# Deploy deleter service
cd ../deleter
./node_modules/.bin/serverless deploy -v

# Deploy storage meta index
cd ../meta-index
./node_modules/.bin/serverless deploy -v

# Deploy harmonized storage
cd ../../harmonized-storage
./node_modules/.bin/serverless deploy -v

# Deploy manager
cd ../ingestion/manager
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

# Deploy value store - elasticsearch instance
cd ../../../../value-store/elasticsearch
./node_modules/.bin/serverless deploy -v

# Deploy value store - projects' functions
cd ../projects
./node_modules/.bin/serverless deploy -v

# Deploy logger - elasticsearch instance
cd ../../logger/elasticsearch
./node_modules/.bin/serverless deploy -v

# Deploy logger - listener
cd ../listener
./node_modules/.bin/serverless deploy -v
