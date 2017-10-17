import { graphiqlLambda } from 'apollo-server-lambda';

const endpointURL = process.env.PROD
  ? `/${process.env.STAGE}/graphql`
  : `/graphql`;

export const handler = graphiqlLambda({ endpointURL });

export default handler;
