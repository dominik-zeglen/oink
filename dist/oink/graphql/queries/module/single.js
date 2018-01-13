const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');
const objectModuleType = require('../../types/module');

module.exports = ((db, acl, userId) => ({
  args: {
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
  },
  type: objectModuleType,
  async resolve(root, params, options) {
    return objectModule.getModule(params.id, db);
  },
}));
