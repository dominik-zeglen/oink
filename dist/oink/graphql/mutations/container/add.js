const graphql = require('graphql');

const container = require('../../../core/containers');

module.exports = ((db, acl, userId) => ({
  args: {
    description: {
      name: 'description',
      type: graphql.GraphQLString,
    },
    name: {
      name: 'name',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    parentId: {
      name: 'parentId',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    visible: {
      name: 'visible',
      type: graphql.GraphQLBoolean,
    },
  },
  type: graphql.GraphQLID,
  async resolve(root, params, options) {
    params.createdAt = +(new Date());
    return container.addContainer(params, db).then(r => r._id);
  },
}));
