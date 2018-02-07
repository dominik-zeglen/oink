const graphql = require('graphql');

const users = require('../../../core/users');
const userType = require('../../types/user');

module.exports = ((db, acl, userId) => ({
  args: {
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
  },
  type: graphql.GraphQLBoolean,
  async resolve(root, params, userId) {
    return users.removeUser(params.id, db);
  },
}));
