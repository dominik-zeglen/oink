const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');
const { ModuleFieldInput } = require('../../types/fields');

module.exports = ((db, acl, userId) => ({
  args: {
    fields: {
      name: 'fields',
      type: new graphql.GraphQLList(ModuleFieldInput),
    },
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
  },
  type: graphql.GraphQLID,
  async resolve(root, params, options) {
    return objectModule.addModuleFields(params.id, params.fields, db);
  },
}));
