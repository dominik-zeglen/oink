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
    if (acl.isAllowed(userId, 'users', 'read')) {
      return users.getUser(params.id, db);
    }
    return new Error('ENOACCESS');
  },
}));
