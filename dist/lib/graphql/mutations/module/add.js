const graphql = require('graphql');
const isUndefined = require('util').isUndefined;
const ObjectFieldInput = require('../../types/objectField').ObjectFieldInput;

const validateSchema = (schema) => {
  const required = ['name', 'fields'];
  const allowed = ['description'];
  const replace = [];
  const defaults = {
    created_at: +(new Date()),
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

module.exports = ((db) => {
  return {
    args: {
      description: {
        name: 'description',
        type: graphql.GraphQLString,
      },
      fields: {
        name: 'fields',
        type: new graphql.GraphQLList(ObjectFieldInput),
      },
      name: {
        name: 'name',
        type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      },
    },
    type: graphql.GraphQLID,
    async resolve(root, params, options) {
      return (await db.get('modules').insert(validateSchema(params)))._id;
    },
  };
});
