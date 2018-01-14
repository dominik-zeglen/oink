const graphql = require('graphql');

const siteObject = require('../../../core/objects');
const { ObjectFieldInput } = require('../../types/fields');
const objectType = require('../../types/object');

module.exports = ((db, acl, userId) => ({
  args: {
    fields: {
      name: 'fields',
      type: new graphql.GraphQLList(ObjectFieldInput),
    },
    module: {
      name: 'module',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    name: {
      name: 'name',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    parentId: {
      name: 'parentId',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    visible: {
      name: 'visible',
      type: graphql.GraphQLBoolean,
    },
  },
  type: objectType,
  async resolve(root, params, options) {
    return siteObject.addObject(params, db);
  },
}));
