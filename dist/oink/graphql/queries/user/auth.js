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
  async resolve(root, params, context) {
    const hasLogged = await users.authenticateUser(params.login, params.pass, db);
    if (hasLogged) {
      return db.get('users').findOne({ login: params.login })
        .then((user) => {
          context.updateSessionData({
            userId: user._id,
          });
          return true;
        })
        .catch(err => err);
    }
    return false;
  },
}));
