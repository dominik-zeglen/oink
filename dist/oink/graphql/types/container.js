const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
  fields: {
    _id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
    created_at: {
      type: graphql.GraphQLString,
    },
    description: {
      type: graphql.GraphQLString,
    },
    name: {
      type: graphql.GraphQLString,
    },
    parent_id: {
      type: graphql.GraphQLString,
    },
    visible: {
      type: graphql.GraphQLBoolean,
    },
  },
  name: 'OinkContainer',
});
