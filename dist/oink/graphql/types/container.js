const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
  fields: {
    _id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
    createdAt: {
      type: graphql.GraphQLString,
    },
    description: {
      type: graphql.GraphQLString,
    },
    name: {
      type: graphql.GraphQLString,
    },
    parentId: {
      type: graphql.GraphQLString,
    },
    visible: {
      type: graphql.GraphQLBoolean,
    },
  },
  name: 'OinkContainer',
});
