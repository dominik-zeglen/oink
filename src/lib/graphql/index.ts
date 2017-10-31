import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import mutations from './mutations';
import queries from './queries';

export default (db) => {
  return new GraphQLSchema({
    mutation: new GraphQLObjectType({
      fields: mutations(db),
      name: 'Mutation',
    }),
    query: new GraphQLObjectType({
      fields: queries(db),
      name: 'Query',
    }),
  });
};
