import {
  GraphQLID, GraphQLList,
  GraphQLNonNull,
} from 'graphql';

import Module from '../../types/module';

export default ((db) => {
  return {
    type: new GraphQLList(Module),
    async resolve(root, params, options) {
      const data = await db.get('modules').find();
      console.log(JSON.stringify(data));
      return (data);
    },
  };
});
