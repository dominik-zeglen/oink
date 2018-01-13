const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');
const objectModuleType = require('../../types/module');

module.exports = ((db, acl, userId) => ({
  type: new graphql.GraphQLList(objectModuleType),
  async resolve(root, params, options) {
    return objectModule.getModules(db);
  },
}));
