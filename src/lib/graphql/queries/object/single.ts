import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import container from '../../types/container';

export default ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: GraphQLID,
      },
    },
    type: container,
    async resolve(root, params, options) {
      return (await db.get('containers').findOne(params.id ? {_id: params.id} : {parent_id: -1}));
    },
  };
});
