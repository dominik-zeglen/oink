const graphql = require('graphql');
const ObjectFieldInput = require('../../types/objectField').ObjectFieldInput;

module.exports = ((db, acl, userId) => {
  return {
    args: {
      fields: {
        name: 'fields',
        type: new graphql.GraphQLList(ObjectFieldInput),
      },
      id: {
        name: 'id',
        type: new graphql.GraphQLNonNull(graphql.GraphQLID),
      },
    },
    type: graphql.GraphQLID,
    async resolve(root, params, options) {
      return await db.get('modules').update({_id: params.id}, {$push: {
        fields: {
          $each: params.fields,
        },
      }});
    },
  };
});
