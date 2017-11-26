const graphql = require('graphql');

const container = require('../../types/container');

module.exports = ((db, acl, userId) => {
  function noop(root, params, options) {
    return null;
  }
  async function output(root, params, options) {
    return (await db.get('containers').findOne(params.id ? {_id: params.id} : {parent_id: -1}));
  }
  return {
    args: {
      id: {
        name: 'id',
        type: graphql.GraphQLString,
      },
    },
    type: container,
    resolve: output
  };
});
