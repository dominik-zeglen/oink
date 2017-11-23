const graphql = require('graphql');

const fields = {
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
};
const ObjectFieldInput = new graphql.GraphQLInputObjectType({
  fields,
  name: 'OinkObjectFieldInputType',
});
const ObjectFieldType = new graphql.GraphQLObjectType({
  fields,
  name: 'OinkObjectFieldType',
});

module.exports = {
  default: ObjectFieldType,
  ObjectFieldType,
  ObjectFieldInput,
};
