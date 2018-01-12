function ensureSchema(model, schema) {
  const validatedObject = {};

  Object.keys(schema)
    .forEach((key) => {
      if (schema[key].required && !model[key]) {
        throw new Error(`Missing property: ${key}`);
      }
      validatedObject[key] = model[key] || schema[key].default;
    });

  return validatedObject;
}

module.exports = {
  ensureSchema,
};
