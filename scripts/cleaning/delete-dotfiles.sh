#!/bin/sh

# Remove old deployment states
rm -rf **/.serverless

# Remove old exports of variables, that's good when you change stage
rm -rf **/.env

echo 'All dot files removed!'
