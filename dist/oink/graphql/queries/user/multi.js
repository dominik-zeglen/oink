const graphql = require('graphql');

const users = require('../../../core/users');
const userType = require('../../types/user');

module.exports = ((db, acl, userId) => ({
  type: new graphql.GraphQLList(userType),
  async resolve(root, params, options) {
    if (acl.isAllowed(userId, 'users', 'read')) {
      return users.getUsers(db);
    }
    return new Error('ENOACCESS');
  },
}));
