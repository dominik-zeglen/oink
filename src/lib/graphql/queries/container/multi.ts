import {
  GraphQLList,
} from 'graphql';

import container from '../../types/container';

export default ((db) => {
  return {
    type: new GraphQLList(container),
    async resolve(root, params, options) {
      return (await db.get('containers').find({}));
    },
  };
});
