#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy demo

cd ./demo/server
echo 'Start demo server deploy ...'
yarn deploy

cd ../client
echo 'Start demo client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying ...'
yarn run release
