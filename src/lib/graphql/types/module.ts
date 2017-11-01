import {
  GraphQLBoolean,
  GraphQLID, GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import ObjectField from "./objectField";

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
    fields: {
      type: new GraphQLList(ObjectField),
    },
    name: {
      type: GraphQLString,
    },
  },
  name: 'OinkModule',
});
