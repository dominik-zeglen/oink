import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import container from '../../types/module';

export default ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    type: container,
    async resolve(root, params, options) {
      return (await db.get('modules').findOne({_id: params.id}));
    },
  };
});