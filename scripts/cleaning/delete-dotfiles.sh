#!/bin/sh

# Remove old deployment states
find . -name "*.serverless" -type d -exec rm -rf {} +

# Remove old exports of variables, that's good when you change stage
find . -name "*.env" -type f -delete

echo 'All previous serverless exports removed!'
