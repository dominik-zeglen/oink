const graphql = require('graphql');

const ModuleFieldInput = new graphql.GraphQLInputObjectType({
  fields: {
    displayName: {
      type: graphql.GraphQLString,
    },
    type: {
      type: graphql.GraphQLString,
    },
  },
  name: 'ModuleFieldInput',
});
const ModuleFieldType = new graphql.GraphQLObjectType({
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
  },
  name: 'ModuleField',
});
const ObjectFieldInput = new graphql.GraphQLInputObjectType({
  fields: {
    name: {
      type: graphql.GraphQLString,
    },
    value: {
      type: graphql.GraphQLString,
    },
  },
  name: 'ObjectFieldInput',
});
const ObjectFieldType = new graphql.GraphQLObjectType({
  fields: {
    name: {
      type: graphql.GraphQLString,
    },
    value: {
      type: graphql.GraphQLString,
    },
  },
  name: 'ObjectField',
});
module.exports = {
  ModuleFieldType,
  ModuleFieldInput,
  ObjectFieldType,
  ObjectFieldInput,
};
