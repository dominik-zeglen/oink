const graphql = require('graphql');

const mutations = require('./mutations');
const queries = require('./queries');

module.exports = ((db, userId) => {
  return new graphql.GraphQLSchema({
    mutation: new graphql.GraphQLObjectType({
      fields: mutations(db, userId),
      name: 'Mutation',
    }),
    query: new graphql.GraphQLObjectType({
      fields: queries(db, userId),
      name: 'Query',
    }),
  });
});
