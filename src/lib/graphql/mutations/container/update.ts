import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull, GraphQLString,
} from 'graphql';

export default ((db) => {
  return {
    args: {
      description: {
        name: 'description',
        type: GraphQLString,
      },
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID),
      },
      name: {
        name: 'name',
        type: GraphQLString,
      },
      visible: {
        name: 'visible',
        type: GraphQLBoolean,
      },
    },
    type: GraphQLID,
    async resolve(root, params, options) {
      const data = (await db.get('containers').update({_id: params.id}, {$set: {
        description: params.description,
        name: params.name,
        visible: params.visible,
      }}));
      return data;
    },
  };
});
