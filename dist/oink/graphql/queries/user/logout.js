const graphql = require('graphql');

const users = require('../../../core/users');

module.exports = ((db, acl, userId) => ({
  type: graphql.GraphQLBoolean,
  async resolve(root, params, context) {
    return context.updateSessionData({
      userId: null,
    });
  },
}));
