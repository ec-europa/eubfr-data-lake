#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy storage
cd ./resources/raw-storage
./node_modules/.bin/serverless deploy -v

# Deploy harmonized storage
cd ../harmonized-storage
./node_modules/.bin/serverless deploy -v

# Deploy elasticsearch domains and indices
cd ../elasticsearch
./node_modules/.bin/serverless deploy -v
