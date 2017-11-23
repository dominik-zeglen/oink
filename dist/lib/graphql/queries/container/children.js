const graphql = require('graphql');

const container = require('../../types/container');

module.exports = ((db) => {
  return {
    args: {
      parentId: {
        name: 'parentId',
        type: graphql.GraphQLString,
      },
    },
    type: new graphql.GraphQLList(container),
    async resolve(root, params, options) {
      return await db.get('containers').find({parent_id: params.parentId ? params.parentId : -1});
    },
  };
});
