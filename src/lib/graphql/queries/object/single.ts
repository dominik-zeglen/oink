import {
  GraphQLID,
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
      return (await db.get('objects').findOne({_id: params.id}));
    },
  };
});
