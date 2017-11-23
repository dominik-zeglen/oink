const graphql = require('graphql');
const isUndefined = require('util').isUndefined;
const ObjectFieldInput = require('../../types/objectField').ObjectFieldInput;

const validateSchema = (schema) => {
  const required = ['parentId', 'name', 'module', 'fields'];
  const allowed = ['visible'];
  const replace = [
    {
      after: 'parent_id',
      before: 'parentId',
    },
  ];
  const defaults = {
    visible: false,
    created_at: +(new Date())
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
    throw new Error('Make sure object contains following properties: ' + required.toString());
  }
};

module.exports = ((db, userId) => {
  return {
    args: {
      fields: {
        name: 'fields',
        type: new graphql.GraphQLList(ObjectFieldInput),
      },
      module: {
        name: 'module',
        type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      },
      name: {
        name: 'name',
        type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      },
      parentId: {
        name: 'parentId',
        type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      },
      visible: {
        name: 'visible',
        type: graphql.GraphQLBoolean,
      },
    },
    type: graphql.GraphQLID,
    async resolve(root, params, options) {
      return (await db.get('objects').insert(validateSchema(params)))._id;
    },
  };
});
