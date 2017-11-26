const graphql = require('graphql');

const ObjectField = require('./objectField').ObjectFieldType;

module.exports = new graphql.GraphQLObjectType({
  fields: {
    _id: {
      type: graphql.GraphQLString,
    },
    created_at: {
      type: graphql.GraphQLString,
    },
    fields: {
      type: new graphql.GraphQLList(ObjectField),
    },
    module: {
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
  name: 'OinkObject',
});
