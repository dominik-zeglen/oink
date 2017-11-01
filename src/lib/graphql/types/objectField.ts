import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export default new GraphQLObjectType({
  fields: {
    displayName: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLID,
    },
    value: {
      type: GraphQLString,
    },
  },
  name: 'ObjectField',
});
