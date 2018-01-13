function ensureSchema(model, schema, checkMutability = false) {
  const validatedObject = {};

  Object.keys(schema)
    .forEach((key) => {
      if (schema[key].required && !model[key]) {
        throw new Error(`Missing property: ${key}`);
      }
      if (checkMutability && !schema[key].mutable) {
        throw new Error(`Immutable property: ${key}`);
      }
      validatedObject[key] = model[key] || schema[key].default;
    });

  return validatedObject;
}

module.exports = {
  ensureSchema,
};
