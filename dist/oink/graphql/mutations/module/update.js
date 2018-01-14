const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');

module.exports = ((db, acl, userId) => ({
  args: {
    description: {
      name: 'description',
      type: graphql.GraphQLString,
    },
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
    name: {
      name: 'name',
      type: graphql.GraphQLString,
    },
  },
  type: graphql.GraphQLID,
  async resolve(root, params, options) {
    return objectModule.updateModule(params.id, params, db);
  },
}));
