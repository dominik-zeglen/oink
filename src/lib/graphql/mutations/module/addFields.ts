import {waterfall} from 'async';
import {
  GraphQLBoolean,
  GraphQLID, GraphQLList,
  GraphQLNonNull, GraphQLString,
} from 'graphql';
import {ObjectFieldInput} from "../../types/objectField";

export default ((db) => {
  return {
    args: {
      fields: {
        name: 'fields',
        type: new GraphQLList(ObjectFieldInput),
      },
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    type: GraphQLID,
    async resolve(root, params, options) {
      const data = (await db.get('modules').update({_id: params.id}, {$set: {
        description: params.description,
        name: params.name,
      }}));
      const data_fields = await db.get('modules').update({_id: params.id}, {$push: {
        fields: {
          $each: params.fields,
        },
      }});
      return data && data_fields;
    },
  };
});
