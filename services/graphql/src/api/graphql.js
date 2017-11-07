import { graphqlLambda } from 'apollo-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';

import { schema } from '../schemata/schema';
import { resolvers } from '../resolvers/resolvers';

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  logger: console,
});

export const handler = (event, context, callback) => {
  const callbackFilter = (error, output) => {
    // eslint-disable-next-line no-param-reassign
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  };

  const gLambda = graphqlLambda({ schema: myGraphQLSchema });
  return gLambda(event, context, callbackFilter);
};

export default handler;
