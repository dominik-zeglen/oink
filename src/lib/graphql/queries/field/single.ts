import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import field from '../../types/field';

export default ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    type: field,
    async resolve(root, params, options) {
      return await db.get('fields').findOne({_id: params.id});
    },
  };
});
