const graphql = require('graphql');

const container = require('../../../core/container');

module.exports = ((db, acl, userId) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new graphql.GraphQLNonNull(graphql.GraphQLID),
      },
    },
    type: graphql.GraphQLBoolean,
    async resolve(root, params, options) {
      return container.removeContainer(params.id, db);
    },
  };
});
