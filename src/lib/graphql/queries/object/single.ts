import {
  GraphQLID,
} from 'graphql';

import object from '../../types/object';

export default ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: GraphQLID,
      },
    },
    type: object,
    async resolve(root, params, options) {
      return (await db.get('objects').findOne({_id: params.id}));
    },
  };
});
