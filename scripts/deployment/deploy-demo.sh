#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ../../

# Deploy demos

## AGRI demo

cd ./demo/dashboard/server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username agri

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=agri yarn run build
yarn run sls client deploy --username agri

## BUDG demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username budg

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=budg yarn run build
yarn run sls client deploy --username budg

## INFOREGIO demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username inforegio

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=inforegio yarn run build
yarn run sls client deploy --username inforegio

## IATI demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username iati

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=iati yarn run build
yarn run sls client deploy --username iati

## VALOR demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username valor

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=valor yarn run build
yarn run sls client deploy --username valor

## WIFI4EU demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username wifi4eu

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=wifi4eu yarn run build
yarn run sls client deploy --username wifi4eu

# Website demo

cd ../../website
echo 'Start demo website deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying website...'
yarn run release
