// Optional dependency helps with formatting in editors.
import { gql } from 'apollo-server-lambda';

const schema = gql`
  type Query {
    ping: String
  }

  schema {
    query: Query
  }
`;

export default schema;
