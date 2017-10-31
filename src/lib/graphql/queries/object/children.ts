import {
  GraphQLID,
  GraphQLList, GraphQLNonNull,
} from 'graphql';

import {ObjectID} from "bson";
import container from '../../types/container';

export default ((db) => {
  return {
    args: {
      parentId: {
        name: 'parentId',
        type: GraphQLID,
      },
    },
    type: new GraphQLList(container),
    async resolve(root, params, options) {
      return await db.get('containers').find({parent_id: params.parentId ? new ObjectID(params.parentId) : -1});
    },
  };
});
