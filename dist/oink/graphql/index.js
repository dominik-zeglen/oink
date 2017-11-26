const graphql = require('graphql');

const mutations = require('./mutations');
const queries = require('./queries');

module.exports = ((db, acl, userId) => {
  return new graphql.GraphQLSchema({
    mutation: new graphql.GraphQLObjectType({
      fields: mutations(db, acl, userId),
      name: 'Mutation',
    }),
    query: new graphql.GraphQLObjectType({
      fields: queries(db, acl, userId),
      name: 'Query',
    }),
  });
});
