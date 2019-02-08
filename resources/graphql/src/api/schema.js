import elasticsearch from 'elasticsearch';
import connectionClass from 'http-aws-es';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { composeWithElastic } from 'graphql-compose-elasticsearch';

import getProjectMapping from '../../../elasticsearch/mappings/project';

const projectMapping = getProjectMapping();

const { API: host, INDEX: elasticIndex, TYPE: elasticType } = process.env;

const ProjectTC = composeWithElastic({
  graphqlTypeName: 'Project',
  elasticIndex,
  elasticType,
  elasticMapping: projectMapping.mappings.project,
  elasticClient: new elasticsearch.Client({
    host,
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

export default schema;
