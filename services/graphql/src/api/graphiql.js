import { graphiqlLambda } from 'apollo-server-lambda';

export const handler = graphiqlLambda({
  endpointURL: '/graphql',
});

export default handler;
