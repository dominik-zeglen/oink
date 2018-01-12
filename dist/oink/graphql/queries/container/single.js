const graphql = require('graphql');

const containerType = require('../../types/container');
const container = require('../../../core/container');

module.exports = ((db, acl, userId) => ({
  args: {
    id: {
      name: 'id',
      type: graphql.GraphQLString,
    },
  },
  type: containerType,
  async resolve(root, params, options) {
    return container.getContainer(params.id, db);
  },
}));
