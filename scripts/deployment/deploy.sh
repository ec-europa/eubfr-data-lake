#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ../../

# Deploy signed uploads service
cd ./services/storage/signed-uploads
npx serverless deploy -v

# Deploy deleter service
cd ../deleter
npx serverless deploy -v

# Deploy manager
cd ../../ingestion/manager
npx serverless deploy -v

# Deploy cleaner
cd ../cleaner
npx serverless deploy -v

# Deploy quality analyzer
cd ../quality-analyzer
npx serverless deploy -v

# Deploy ETL
cd ../etl/agri/csv
npx serverless deploy -v
cd ../../budg/xls
npx serverless deploy -v
cd ../../inforegio/json
npx serverless deploy -v
cd ../../inforegio/xml
npx serverless deploy -v
cd ../../iati/csv
npx serverless deploy -v
cd ../../valor/xls
npx serverless deploy -v
cd ../../wifi4eu/xls
npx serverless deploy -v

# Deploy value store - projects' functions
cd ../../../../value-store/projects
npx serverless deploy -v

# Deploy logger - listener
cd ../../logger/listener
npx serverless deploy -v

# Deploy enrichment - manager
cd ../../enrichment/manager
npx serverless deploy -v

# Deploy enrichment - saver
cd ../saver
npx serverless deploy -v

# Deploy enrichment plugins
cd ../location
npx serverless deploy -v
