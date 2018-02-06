const graphql = require('graphql');

const users = require('../../../core/users');

module.exports = ((db, acl, userId) => ({
  args: {
    login: {
      name: 'login',
      type: graphql.GraphQLString,
    },
    pass: {
      name: 'pass',
      type: graphql.GraphQLString,
    },
  },
  type: graphql.GraphQLBoolean,
  async resolve(root, params, options) {
    return users.authenticateUser(params.login, params.pass, db);
  },
}));
