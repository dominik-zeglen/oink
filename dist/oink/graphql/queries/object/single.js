const graphql = require('graphql');

const siteObject = require('../../types/object');

module.exports = ((db, acl, userId) => {
  return {
    args: {
      id: {
        name: 'id',
        type: graphql.GraphQLID,
      },
    },
    type: siteObject,
    async resolve(root, params, options) {
      return (await db.get('objects').findOne({_id: params.id}));
    },
  };
});
