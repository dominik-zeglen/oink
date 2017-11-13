import {
  GraphQLBoolean,
  GraphQLID, GraphQLList, GraphQLString,
} from 'graphql';

import object from '../../types/object';
import {isUndefined} from "util";

const validateSchema = (schema) => {
  const required = [];
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
    replace.forEach((f) => {
      if (schema[f.before]) {
        schema[f.after] = schema[f.before];
        delete schema[f.before];
      }
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

const toSort = (sort) => {
  if (!sort) {
    return false;
  } else {
    if (sort[0] === '-') {
      const ret = {};
      ret[sort.splice(0, 1)] = -1;
      return ret;
    } else {
      const ret = {};
      ret[sort] = 1;
      return ret;
    }
  }
};

export default ((db) => {
  return {
    args: {
      id: {
        name: 'id',
        type: GraphQLID,
      },
      module: {
        name: 'module',
        type: GraphQLString,
      },
      parentId: {
        name: 'parentId',
        type: GraphQLString,
      },
      sort: {
        name: 'sort',
        type: GraphQLString,
      },
      visible: {
        name: 'visible',
        type: GraphQLBoolean,
      },
    },
    type: new GraphQLList(object),
    async resolve(root, params, options) {
      return (await db.get('objects')
          .find(validateSchema(params), {sort: toSort(params.sort) || {created_at: 1}})
      );
    },
  };
});
