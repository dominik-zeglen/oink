import {GraphQLList, GraphQLString} from 'graphql';

import OinkObject from '../../types/object';

export default ((db) => {
  return {
    args: {
      parentId: {
        name: 'parentId',
        type: GraphQLString,
      },
    },
    type: new GraphQLList(OinkObject),
    async resolve(root, params, options) {
      const data = await db.get('objects').find({parent_id: params.parentId});
      return data;
    },
  };
});
