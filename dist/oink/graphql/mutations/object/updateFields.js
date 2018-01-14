const graphql = require('graphql');

const siteObject = require('../../../core/objects');
const { ObjectFieldInput } = require('../../types/fields');

module.exports = ((db, acl, userId) => ({
  args: {
    id: {
      name: 'id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    fields: {
      name: 'fields',
      type: new graphql.GraphQLNonNull(new graphql.GraphQLList(ObjectFieldInput)),
    },
  },
  type: graphql.GraphQLBoolean,
  async resolve(root, params, options) {
    return siteObject.updateObjectFields(params.id, params.fields, db);
  },
}));
