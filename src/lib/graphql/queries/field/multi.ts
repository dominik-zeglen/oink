import {
  GraphQLList,
} from 'graphql';

import field from '../../types/field';

export default ((db) => {
  return {
    type: new GraphQLList(field),
    async resolve(root, params, options) {
      return (await db.get('fields').find({}));
    },
  };
});
