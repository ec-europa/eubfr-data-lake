import { ApolloServer } from 'apollo-server-lambda';
import schema from './schema';
import resolvers from './resolvers';

const { API_ID, STAGE, REGION, IS_LOCAL } = process.env;

const endpoint = IS_LOCAL
  ? 'http://localhost:4000/graphql'
  : `https://${API_ID}.execute-api.${REGION}.amazonaws.com/${STAGE}/graphql`;

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
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
  // Allow plaground to be used in production.
  introspection: true,
  tracing: true,
});

export const handler = server.createHandler({
  cors: {
    origin: '*',
  },
});

export default handler;
