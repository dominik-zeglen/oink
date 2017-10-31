import {
  GraphQLBoolean,
  GraphQLID, GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import ObjectField from '../types/objectField';

export default new GraphQLObjectType({
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    created_at: {
      type: GraphQLString,
    },
    fields: {
      type: new GraphQLList(ObjectField),
    },
    name: {
      type: GraphQLString,
    },
    parent_id: {
      type: GraphQLString,
    },
    visible: {
      type: GraphQLBoolean,
    },
  },
  name: 'OinkField',
});
