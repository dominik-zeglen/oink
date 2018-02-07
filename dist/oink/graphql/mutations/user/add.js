const graphql = require('graphql');

const users = require('../../../core/users');
const userType = require('../../types/user');


module.exports = ((db, acl, userId) => ({
  args: {
    name: {
      name: 'name',
      type: graphql.GraphQLString,
    },
    login: {
      name: 'login',
      type: graphql.GraphQLString,
    },
    pass: {
      name: 'pass',
      type: graphql.GraphQLString,
    },
  },
  type: userType,
  async resolve(root, params, options) {
    return users.addUser(params, db).then(async (response) => {
      if (response._id) {
        return users.getUser(response._id, db);
      }
      return new Error();
    }).catch(e => e);
  },
}));
