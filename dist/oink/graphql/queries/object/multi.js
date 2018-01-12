const graphql = require('graphql');

const object = require('../../types/object');
const isUndefined = require('util').isUndefined;

const validateSchema = (schema) => {
  const required = [];
  const replace = [
    {
      after: 'parentId',
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

module.exports = ((db, acl, userId) => {
  return {
    args: {
      id: {
        name: 'id',
        type: graphql.GraphQLID,
      },
      module: {
        name: 'module',
        type: graphql.GraphQLString,
      },
      parentId: {
        name: 'parentId',
        type: graphql.GraphQLString,
      },
      sort: {
        name: 'sort',
        type: graphql.GraphQLString,
      },
      visible: {
        name: 'visible',
        type: graphql.GraphQLBoolean,
      },
    },
    type: new graphql.GraphQLList(object),
    async resolve(root, params, options) {
      return (await db.get('objects')
          .find(validateSchema(params), {sort: toSort(params.sort) || {createdAt: 1}})
      );
    },
  };
});
