#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ../../

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
yarn run sls client deploy --username agri --no-confirm

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
yarn run sls client deploy --username budg --no-confirm

## CORDIS demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username cordis

cd ../client
echo 'Start demo dashboard client deploy ...'
echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=cordis yarn run build
yarn run sls client deploy --username cordis --no-confirm

## FTS demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username fts

cd ../client
echo 'Start demo dashboard client deploy ...'
echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=fts yarn run build
yarn run sls client deploy --username fts --no-confirm

## DG HOME demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username home

cd ../client
echo 'Start demo dashboard client deploy ...'
echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying dashboard client...'
EUBFR_USERNAME=home yarn run build
yarn run sls client deploy --username home --no-confirm

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
yarn run sls client deploy --username iati --no-confirm

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
yarn run sls client deploy --username inforegio --no-confirm


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
yarn run sls client deploy --username valor --no-confirm

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
yarn run sls client deploy --username wifi4eu --no-confirm

# Website demo

cd ../../website
echo 'Start demo website deploy ...'
echo 'Cleaning previous builds ...'
rm -rf build

echo 'Deploying website...'
yarn run release
