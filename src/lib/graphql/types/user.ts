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
    login: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    salt: {
      type: GraphQLString,
    },
  },
  name: 'OinkUser',
});
