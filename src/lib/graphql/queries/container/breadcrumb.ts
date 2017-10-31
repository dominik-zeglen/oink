import {
  GraphQLID,
  GraphQLList, GraphQLNonNull,
} from 'graphql';

import {ObjectID} from "bson";
import container from '../../types/container';

export default ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    type: new GraphQLList(container),
    async resolve(root, params, options) {
      let breadcrumb = [];
      let counter = 5;
      let currentContainerId = params.id;
      while (counter > 0 && currentContainerId != '-1') {
        const r = await db.get('containers').findOne({_id: new ObjectID(currentContainerId)});
        breadcrumb.push(r);
        currentContainerId = r.parent_id;
        counter -= 1;
      }
      return breadcrumb.reverse();
    },
  };
});
