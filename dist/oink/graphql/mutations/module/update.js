const graphql = require('graphql');

module.exports = ((db, acl, userId) => ({
  args: {
    description: {
      name: 'description',
      type: graphql.GraphQLString,
    },
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLID),
    },
    name: {
      name: 'name',
      type: graphql.GraphQLString,
    },
  },
  type: graphql.GraphQLID,
  async resolve(root, params, options) {
    return (await db.get('modules').update({ _id: params.id }, {
      $set: {
        description: params.description,
        name: params.name,
      },
    }));
  },
}));
