const graphql = require('graphql');

const container = require('../../types/container');

module.exports = ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new graphql.GraphQLNonNull(graphql.GraphQLID),
      },
    },
    type: new graphql.GraphQLList(container),
    async resolve(root, params, options) {
      let breadcrumb = [];
      let counter = 5;
      let currentContainerId = params.id;
      while (counter > 0 && currentContainerId !== '-1') {
        const r = await db.get('containers').findOne({_id: currentContainerId});
        breadcrumb.push(r);
        currentContainerId = r.parent_id;
        counter -= 1;
      }
      return breadcrumb.reverse();
    },
  };
});
