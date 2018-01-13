const _ = require('lodash');

function toType(obj) {
  return ({}).toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

function ensureSchema(model, schema, checkMutability = false) {
  const validatedObject = {};

  Object.keys(schema)
    .forEach((key) => {
      if (schema[key].required && !model[key]) {
        throw new Error(`Missing property: ${key}`);
      }
      if (model[key] && toType(schema[key].default) !== toType(model[key])) {
        if (schema[key].default.valueOf() === model[key].valueOf()) {
          throw new Error(`Bad property type for: ${key}\nExpected: ${toType(schema[key].default)}, got: ${toType(model[key])}`);
        }
      }
      if (model[key] && checkMutability && !schema[key].mutable) {
        throw new Error(`Immutable property: ${key}`);
      }
      validatedObject[key] = model[key] || schema[key].default;
    });

  return validatedObject;
}

function ensureUnique(arr, fieldName) {
  return _.uniqBy(arr, o => o[fieldName]).length === arr.length;
}

module.exports = {
  ensureSchema,
  ensureUnique,
};
