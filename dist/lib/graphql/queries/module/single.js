const graphql = require('graphql');

const container = require('../../types/module');

module.exports = ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new graphql.GraphQLNonNull(graphql.GraphQLID),
      },
    },
    type: container,
    async resolve(root, params, options) {
      return (await db.get('modules').findOne({_id: params.id}));
    },
  };
});
