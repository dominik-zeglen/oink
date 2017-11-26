const graphql = require('graphql');

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
      await db.get('objects').remove({_id: params.id});
      return true;
    },
  };
});
