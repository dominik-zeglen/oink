const graphql = require('graphql');

const ObjectFieldInput = new graphql.GraphQLInputObjectType({
  fields: {
    displayName: {
      type: graphql.GraphQLString,
    },
    type: {
      type: graphql.GraphQLString,
    },
  },
  name: 'OinkObjectFieldInputType',
});
const ObjectFieldType = new graphql.GraphQLObjectType({
  fields: {
    displayName: {
      type: graphql.GraphQLString,
    },
    name: {
      type: graphql.GraphQLString,
    },
    type: {
      type: graphql.GraphQLString,
    },
    value: {
      type: graphql.GraphQLString,
    },
  },
  name: 'OinkObjectFieldType',
});

module.exports = {
  default: ObjectFieldType,
  ObjectFieldType,
  ObjectFieldInput,
};
