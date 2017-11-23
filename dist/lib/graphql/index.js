const graphql = require('graphql');

const mutations = require('./mutations');
const queries = require('./queries');

module.exports = ((db) => {
  return new graphql.GraphQLSchema({
    mutation: new graphql.GraphQLObjectType({
      fields: mutations(db),
      name: 'Mutation',
    }),
    query: new graphql.GraphQLObjectType({
      fields: queries(db),
      name: 'Query',
    }),
  });
});
