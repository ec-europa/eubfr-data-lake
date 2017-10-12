#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy demo
cd ./demo
echo 'Cleaning previous client builds of the demo ...'
rm -rf client/build client/dist
echo 'Building a new client app for the demo ...'
yarn run build
echo 'Deploying all parts for the demo ...'
yarn run deploy
