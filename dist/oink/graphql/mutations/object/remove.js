const graphql = require('graphql');

const siteObject = require('../../../core/objects');

module.exports = ((db, acl, userId) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new graphql.GraphQLNonNull(graphql.GraphQLID),
      },
    },
    type: graphql.GraphQLBoolean,
    async resolve(root, params, options) {
      return siteObject.removeObject(params.id, db);
    },
  };
});
