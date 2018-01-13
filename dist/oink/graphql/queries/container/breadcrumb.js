const graphql = require('graphql');

const containerType = require('../../types/container');
const container = require('../../../core/containers');

module.exports = ((db, acl, userId) => ({
  args: {
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
  },
  type: new graphql.GraphQLList(containerType),
  async resolve(root, params, options) {
    return container.getContainerAncestors(params.id, db);
  },
}));
