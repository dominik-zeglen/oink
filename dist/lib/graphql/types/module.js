const graphql = require('graphql');

const ObjectFieldType = require('./objectField').ObjectFieldType;

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
    fields: {
      type: new graphql.GraphQLList(ObjectFieldType),
    },
    name: {
      type: graphql.GraphQLString,
    },
  },
  name: 'OinkModule',
});
