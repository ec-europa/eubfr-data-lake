#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ../../

# The place to have ELK-related assets

# Deploy a bucket for backup of ES assets, such as kibana index snapshot
cd ./resources/backup-storage
npx serverless deploy -v

# Deploy compute stopper service
cd ../../services/compute/stopper
npx serverless deploy -v
