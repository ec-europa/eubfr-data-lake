#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ../../

# The place to have ELK-related assets

# Deploy compute stopper service
cd ./services/compute/stopper
npx serverless deploy -v
