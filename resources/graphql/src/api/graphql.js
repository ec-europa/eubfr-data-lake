import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { composeWithElastic } from 'graphql-compose-elasticsearch';
import { ApolloServer } from 'apollo-server-lambda';

import getProjectMapping from '../../../elasticsearch/mappings/project';

const projectMapping = getProjectMapping();

const { API_ID, API, INDEX, TYPE, STAGE, REGION, IS_LOCAL } = process.env;

const endpoint = IS_LOCAL
  ? 'http://localhost:4000/graphql'
  : `https://${API_ID}.execute-api.${REGION}.amazonaws.com/${STAGE}/graphql`;

const ProjectTC = composeWithElastic({
  graphqlTypeName: 'Project',
  elasticIndex: INDEX,
  elasticType: TYPE,
  elasticMapping: projectMapping.mappings.project,
  elasticClient: new elasticsearch.Client({
    host: `https://${API}`,
    connectionClass,
    apiVersion: '6.3',
    trace: true,
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      projects: ProjectTC.getResolver('search').getFieldConfig(),
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

export const handler = server.createHandler({
  cors: {
    origin: '*',
  },
});

export default handler;
