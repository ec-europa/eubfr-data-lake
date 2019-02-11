import { promisify } from 'util';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import awscred from 'awscred';

import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { composeWithElastic } from 'graphql-compose-elasticsearch';
import { ApolloServer } from 'apollo-server-lambda';

import getProjectMapping from '@eubfr/resources-elasticsearch/mappings/project';

const getUserCredentials = promisify(awscred.load);
const projectMapping = getProjectMapping();

// Wrapper around apollo server's factory to allow for async operations.
const createHandler = async () => {
  const {
    API_ID,
    API,
    INDEX,
    TYPE,
    STAGE,
    REGION: region,
    IS_LOCAL,
    SERVICE_SECRET_NAME,
  } = process.env;

  const endpoint = IS_LOCAL
    ? 'http://localhost:4000/graphql'
    : `https://${API_ID}.execute-api.${region}.amazonaws.com/${STAGE}/graphql`;

  let accessKeyId = '';
  let secretAccessKey = '';

  if (IS_LOCAL) {
    const credentials = await getUserCredentials();

    const { accessKeyId: id, secretAccessKey: key } = credentials.credentials;
    accessKeyId = id;
    secretAccessKey = key;
  } else {
    const secretsManager = new AWS.SecretsManager();
    const secretsResponse = await secretsManager
      .getSecretValue({ SecretId: SERVICE_SECRET_NAME })
      .promise();

    const secrets = JSON.parse(secretsResponse.SecretString);

    const { AWS_ACCESS_KEY_ID: id, AWS_SECRET_ACCESS_KEY: key } = secrets;

    accessKeyId = id;
    secretAccessKey = key;
  }

  const elasticClient = new elasticsearch.Client({
    host: `https://${API}`,
    connectionClass,
    awsConfig: new AWS.Config({
      accessKeyId,
      secretAccessKey,
      region,
    }),
    apiVersion: '6.3',
    trace: true,
  });

  const ProjectTC = composeWithElastic({
    apiVersion: '6.3',
    graphqlTypeName: 'Project',
    elasticIndex: INDEX,
    elasticType: TYPE,
    elasticMapping: projectMapping.mappings.project,
    elasticClient,
    pluralFields: [
      'ec_priorities',
      'media',
      'project_locations',
      'related_links',
      'themes',
      'third_parties',
      'type',
    ],
    elasticApiFilePath: './src/api/6_3.js',
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        projectById: ProjectTC.getResolver('findById').getFieldConfig(),
        projects: ProjectTC.getResolver('search').getFieldConfig(),
        projectsPagination: ProjectTC.getResolver(
          'searchPagination'
        ).getFieldConfig(),
      },
    }),
  });

  const server = new ApolloServer({
    schema,
    formatError: error => {
      console.error(error);
      return error;
    },
    context: ({ event, context }) => ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }),
    playground: { endpoint },
    // Allow playground to be used when deployed.
    introspection: true,
    tracing: true,
  });

  return server.createHandler({
    cors: {
      origin: '*',
    },
  });
};

export const handler = (event, context, callback) => {
  createHandler()
    .then(handle => handle(event, context, callback))
    .catch(e => callback(e));
};

export default handler;
