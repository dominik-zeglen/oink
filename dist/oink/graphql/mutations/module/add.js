const graphql = require('graphql');

const objectModule = require('../../../core/object_modules');
const ObjectFieldInputType = require('../../types/objectField').ObjectFieldInput;

module.exports = ((db, acl, userId) => {
  return {
    args: {
      description: {
        name: 'description',
        type: graphql.GraphQLString,
      },
      fields: {
        name: 'fields',
        type: new graphql.GraphQLList(ObjectFieldInputType),
      },
      name: {
        name: 'name',
        type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      },
    },
    type: graphql.GraphQLID,
    async resolve(root, params, options) {
      return objectModule.addModule(params, db).then(m => m._id);
    },
  };
});
