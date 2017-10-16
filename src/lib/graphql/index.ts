import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

// import mutations from './mutations';
import queries from './queries';

export default (db) => {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      fields: queries(db),
      name: 'Query',
    }),
    // mutation: new GraphQLObjectType({
    //   name: 'Mutation',
    //   fields: mutations
    // })
  });
};
