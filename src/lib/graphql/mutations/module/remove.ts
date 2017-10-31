import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull, GraphQLString,
} from 'graphql';

export default ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    type: GraphQLBoolean,
    async resolve(root, params, options) {
      await db.get('modules').remove({_id: params.id});
      return true;
    },
  };
});
