const graphql = require('graphql');

module.exports = ((db, userId) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new graphql.GraphQLNonNull(graphql.GraphQLID),
      },
    },
    type: graphql.GraphQLBoolean,
    async resolve(root, params, options) {
      await db.get('containers').remove({_id: params.id});
      return true;
    },
  };
});
