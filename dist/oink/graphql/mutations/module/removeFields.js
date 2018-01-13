const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');

module.exports = ((db, acl, userId) => ({
  args: {
    fields: {
      name: 'fields',
      type: new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql.GraphQLString)),
    },
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
  },
  type: graphql.GraphQLID,
  async resolve(root, params, options) {
    return objectModule.removeModuleFields(params.id, params.fields, db);
  },
}));
