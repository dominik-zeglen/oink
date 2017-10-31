import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export default new GraphQLObjectType({
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
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
