import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const fields = {
  displayName: {
    type: GraphQLString,
  },
  name: {
    type: GraphQLString,
  },
  type: {
    type: GraphQLString,
  },
  value: {
    type: GraphQLString,
  },
};
const ObjectFieldInput = new GraphQLInputObjectType({
  fields,
  name: 'OinkObjectFieldInputType',
});
const ObjectFieldType = new GraphQLObjectType({
  fields,
  name: 'OinkObjectFieldType',
});

export {
  ObjectFieldType as default,
  ObjectFieldInput,
};
