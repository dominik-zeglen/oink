const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');

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
      return objectModule.removeModule(params.id, db);
    },
  };
});
