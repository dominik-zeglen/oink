const graphql = require('graphql');

const container = require('../../types/container');

module.exports = ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: graphql.GraphQLID,
      },
    },
    type: container,
    async resolve(root, params, options) {
      return (await db.get('containers').findOne(params.id ? {_id: params.id} : {parent_id: -1}));
    },
  };
});
