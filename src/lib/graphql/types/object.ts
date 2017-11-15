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
      type: GraphQLString,
    },
    created_at: {
      type: GraphQLString,
    },
    fields: {
      type: new GraphQLList(ObjectField),
    },
    module: {
      type: GraphQLString,
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
  name: 'OinkObject',
});
