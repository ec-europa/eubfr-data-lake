#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy elasticsearch domains
cd ./resources/elasticsearch
./node_modules/.bin/serverless deploy -v
