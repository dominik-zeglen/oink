const graphql = require('graphql');

const { ModuleFieldType } = require('./fields');

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
    fields: {
      type: new graphql.GraphQLList(ModuleFieldType),
    },
    name: {
      type: graphql.GraphQLString,
    },
  },
  name: 'ObjectModule',
});
