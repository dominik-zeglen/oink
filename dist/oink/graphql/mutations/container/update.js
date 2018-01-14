const graphql = require('graphql');

const container = require('../../../core/containers');

module.exports = ((db, acl, userId) => {
  return {
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
      visible: {
        name: 'visible',
        type: graphql.GraphQLBoolean,
      },
    },
    type: graphql.GraphQLBoolean,
    async resolve(root, params, options) {
      return container.updateContainer(params.id, params, db);
    },
  };
});
