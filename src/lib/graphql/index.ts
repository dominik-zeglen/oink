import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

// import mutations from './mutations';
import queries from './queries';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: queries,
    name: 'Query',
  }),
  // mutation: new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: mutations
  // })
});
