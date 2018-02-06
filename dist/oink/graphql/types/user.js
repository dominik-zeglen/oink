const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
  fields: {
    _id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
    createdAt: {
      type: graphql.GraphQLString,
    },
    login: {
      type: graphql.GraphQLString,
    },
    name: {
      type: graphql.GraphQLString,
    },
  },
  name: 'OinkUser',
});
