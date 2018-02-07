const graphql = require('graphql');

const users = require('../../../core/users');
const userType = require('../../types/user');

module.exports = ((db, acl, userId) => ({
  args: {
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
  },
  type: userType,
  async resolve(root, params, options) {
    return users.getUser(params.id, db);
  },
}));
