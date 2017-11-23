const graphql = require('graphql');

const object = require('../../types/object');

module.exports = ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: graphql.GraphQLID,
      },
    },
    type: object,
    async resolve(root, params, options) {
      return (await db.get('objects').findOne({_id: params.id}));
    },
  };
});
