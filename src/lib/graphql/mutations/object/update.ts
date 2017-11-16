import {
  GraphQLBoolean,
  GraphQLID, GraphQLList,
  GraphQLNonNull, GraphQLString,
} from 'graphql';
import {isEmpty} from "../../../helpers";
import {ObjectFieldInput} from "../../types/objectField";

const validateSchema = (schema) => {
  const required = [];
  const allowed = ['name', 'parentId', 'fields', 'visible'];
  const replace = [
    {
      after: 'parent_id',
      before: 'parentId',
    },
    {
      after: '_id',
      before: 'id',
    },
  ];
  const defaults = {};

  const score = Object.keys(schema).filter((f) => {
    return required.indexOf(f) > -1;
  }).length;

  if (score === required.length) {
    const schemaTemporary = {};
    Object.keys(schema).filter((f) => {
      return (required.indexOf(f) > -1) || (allowed.indexOf(f) > -1);
    }).forEach((f) => {
      schemaTemporary[f] = schema[f];
    });
    schema = schemaTemporary;
    replace.forEach((f) => {
      if (!isEmpty(schema[f.before])) {
        schema[f.after] = schema[f.before];
        delete schema[f.before];
      }
    });
    Object.keys(defaults).forEach((f) => {
      if (isEmpty(schema[f]) && !isEmpty(defaults[f])) {
        schema[f] = defaults[f];
      }
    });
    return schema;
  } else {
    throw new Error('Make sure object contains following properties: ' + required.toString());
  }
};

export default ((db) => {
  return {
    args: {
      fields: {
        name: 'fields',
        type: new GraphQLList(ObjectFieldInput),
      },
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        name: 'name',
        type: GraphQLString,
      },
      parentId: {
        name: 'parentId',
        type: GraphQLString,
      },
      visible: {
        name: 'visible',
        type: GraphQLBoolean,
      },
    },
    type: GraphQLID,
    async resolve(root, params, options) {
      const toSet = validateSchema(params);
      console.log(JSON.stringify(toSet));
      const data = await db.get('objects').update({_id: params.id}, {$set: toSet});
      return data._id;
    },
  };
});
