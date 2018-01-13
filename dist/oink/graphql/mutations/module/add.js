const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');
const { ModuleFieldInput } = require('../../types/fields');

module.exports = ((db, acl, userId) => ({
  args: {
    description: {
      name: 'description',
      type: graphql.GraphQLString,
    },
    fields: {
      name: 'fields',
      type: new graphql.GraphQLList(ModuleFieldInput),
    },
    name: {
      name: 'name',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
  },
  type: graphql.GraphQLID,
  async resolve(root, params, options) {
    return objectModule.addModule(params, db).then(m => m._id);
  },
}));
