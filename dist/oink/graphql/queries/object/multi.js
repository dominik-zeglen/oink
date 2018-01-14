const graphql = require('graphql');

const siteObject = require('../../../core/objects');
const objectType = require('../../types/object');

module.exports = ((db, acl, userId) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new graphql.GraphQLNonNull(graphql.GraphQLID),
      },
    },
    type: new graphql.GraphQLList(objectType),
    async resolve(root, params, options) {
      return siteObject.getObjectsFromContainer(params.id, db);
    },
  };
});
