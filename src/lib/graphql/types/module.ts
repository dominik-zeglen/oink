import {
  GraphQLBoolean,
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
    created_at: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
  },
  name: 'OinkModule',
});
