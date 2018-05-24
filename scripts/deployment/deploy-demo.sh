#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ../../

# Deploy demos

## IATI demo

cd demo/dashboard/server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username iati

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying dashboard client...'
EUBFR_USERNAME=iati yarn run build
yarn run sls client deploy --username iati
