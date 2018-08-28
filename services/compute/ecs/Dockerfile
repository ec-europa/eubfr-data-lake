FROM node:8

# Environment variables acting as parameters of the runner.
ENV AWS_LAMBDA_FUNCTION_EVENT {}
ENV AWS_LAMBDA_FUNCTION_CONTEXT {}

# RUN apt-get update
# RUN apt-get install -y unzip

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install

# RUN unzip -o .serverless/parseXls.zip

CMD ["sh", "-c", "./runner.js --event ${AWS_LAMBDA_FUNCTION_EVENT} --context ${AWS_LAMBDA_FUNCTION_CONTEXT}"]

