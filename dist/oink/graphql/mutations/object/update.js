const graphql = require('graphql');

const siteObject = require('../../../core/objects');
const { ObjectFieldInput } = require('../../types/fields');

module.exports = ((db, acl, userId) => ({
  args: {
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    name: {
      name: 'name',
      type: graphql.GraphQLString,
    },
    parentId: {
      name: 'parentId',
      type: graphql.GraphQLString,
    },
    visible: {
      name: 'visible',
      type: graphql.GraphQLBoolean,
    },
  },
  type: graphql.GraphQLBoolean,
  async resolve(root, params, options) {
    return siteObject.updateObject(params.id, params, db);
  },
}));
