#!/bin/bash

echo 'Cleaning previous assets'
rm -rf ./vendors
rm -rf demo/dashboard/client/public/ecl/
rm -rf demo/website/client/public/ecl/

echo 'Getting ECL ec-preset-website.zip 1.0.0'
wget https://github.com/ec-europa/europa-component-library/releases/download/v1.0.0/ec-preset-website.zip

echo 'Moving assets into right folder'
mkdir ./vendors
mkdir ./vendors/ecl
mv ec-preset-website.zip ./vendors/ecl/ec-preset-website.zip

echo 'De-compression ...'
cd ./vendors/ecl
unzip ec-preset-website.zip
rm ec-preset-website.zip
