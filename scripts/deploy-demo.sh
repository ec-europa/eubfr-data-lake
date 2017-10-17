#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy demos

## BUDG demo

cd ./demo/budg/server
echo 'Start demo server deploy ...'
yarn deploy

cd ../dashboard
echo 'Start demo dashboard deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying BUDG dashboard...'
yarn run release

## Website demo

cd ../../website
echo 'Start demo website deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying website...'
yarn run release
