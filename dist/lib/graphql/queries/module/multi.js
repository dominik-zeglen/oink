const graphql = require('graphql');

const Module = require('../../types/module');

module.exports = ((db, userId) => {
  return {
    type: new graphql.GraphQLList(Module),
    async resolve(root, params, options) {
      const data = await db.get('modules').find();
      return (data);
    },
  };
});
