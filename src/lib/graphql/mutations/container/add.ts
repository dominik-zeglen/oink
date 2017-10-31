import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull, GraphQLString,
} from 'graphql';
import {isUndefined} from "util";
import {currentDateTime} from "../../../helpers";

const validateSchema = (schema) => {
  const required = ['parentId', 'name'];
  const allowed = ['description'];
  const replace = [
    {
      after: 'parent_id',
      before: 'parentId',
    },
  ];
  const defaults = {
    visible: true,
  };

  const score = Object.keys(schema).filter((f) => {
    return required.indexOf(f) > -1;
  }).length;

  if (score === required.length) {
    Object.keys(schema).filter((f) => {
      return (required.indexOf(f) > -1) || (allowed.indexOf(f) > -1);
    });
    replace.forEach((f) => {
      schema[f.after] = schema[f.before];
      delete schema[f.before];
    });
    Object.keys(defaults).forEach((f) => {
      if (isUndefined(schema[f])) {
        schema[f] = defaults[f];
      }
    });
    return schema;
  } else {
    return new Error('Make sure object contains following properties: ' + required.toString());
  }
};

export default ((db) => {
  return {
    args: {
      description: {
        name: 'description',
        type: GraphQLString,
      },
      name: {
        name: 'name',
        type: new GraphQLNonNull(GraphQLString),
      },
      parentId: {
        name: 'parentId',
        type: new GraphQLNonNull(GraphQLString),
      },
      visible: {
        name: 'visible',
        type: GraphQLBoolean,
      },
    },
    type: GraphQLID,
    async resolve(root, params, options) {
      let schema = validateSchema(params);
      schema.created_at = currentDateTime();
      const data = (await db.get('containers').insert(schema));
      return data._id;
    },
  };
});
