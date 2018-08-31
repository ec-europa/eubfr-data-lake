FROM node:8

# Environment variables acting as parameters of the runner.
ENV AWS_LAMBDA_FUNCTION_EVENT {}
ENV AWS_LAMBDA_FUNCTION_CONTEXT {}

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install

# Parameters are named arguments extracted later with yargs or something else working on argv.
CMD ["sh", "-c", "./runner.js --event ${AWS_LAMBDA_FUNCTION_EVENT} --context ${AWS_LAMBDA_FUNCTION_CONTEXT}"]

