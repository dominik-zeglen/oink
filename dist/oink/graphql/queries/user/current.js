const graphql = require('graphql');

module.exports = ((db, acl, userId) => ({
  type: graphql.GraphQLString,
  async resolve(root, params, context) {
    if (context.getSessionData().userId) {
      return db.get('users')
        .findOne({ _id: context.getSessionData().userId })
        .then(user => user.login)
        .catch(err => err);
    }
    return new Error('Not logged in');
  },
}));
