const graphql = require('graphql');

const containerType = require('../../types/container');
const container = require('../../../core/containers');

module.exports = ((db, acl, userId) => {
  return {
    args: {
      parentId: {
        name: 'parentId',
        type: graphql.GraphQLString,
      },
    },
    type: new graphql.GraphQLList(containerType),
    async resolve(root, params, options) {
      return container.getContainerChildren(params.parentId, db);
    },
  };
});
