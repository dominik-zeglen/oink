const slug = require("slug");

const { ensureSchema, ensureUnique } = require("./utils");
const settings = require("../../../settings");

const moduleSchema = {
  name: {
    default: "New module",
    required: false,
    mutable: true
  },
  description: {
    default: "",
    required: false,
    mutable: true
  },
  fields: {
    default: [],
    required: false,
    mutable: false
  }
};
const moduleFieldSchema = {
  displayName: {
    default: "",
    required: true
  },
  type: {
    default: "",
    required: true
  }
};

function createModuleFields(model) {
  const slugOptions = {
    replacement: "_",
    lower: true
  };

  if (!ensureUnique(model, "displayName")) {
    throw new Error("Given module fields model has duplicates");
  }
  return model
    .map(field => ensureSchema(field, moduleFieldSchema))
    .map(field => ({
      ...field,
      name: slug(field.displayName, slugOptions)
    }));
}

/**
 * Adds new module
 * @param {{name: string, description: string, fields: Array<{displayName: string, type: string}>}} model - module model
 * @param db
 */
async function addModule(db, model) {
  const params = {
    createdAt: +new Date()
  };
  const validatedModel = ensureSchema(model, moduleSchema);
  if (validatedModel.fields.length) {
    validatedModel.fields = createModuleFields(validatedModel.fields);
  }
  return db.get("modules").insert({ ...params, ...validatedModel });
}

/**
 * Returns module
 * @param db - database client instance
 * @param {string} id - module's id
 */
async function getModule(db, id) {
  return db.get("modules").findOne({ _id: id });
}

/**
 * Returns all modules
 * @param db - database client instance
 * @param {number} paginateBy - page size
 * @param {number} page - page number
 * @param {{field: string, order: number}} sort - sort model
 */
async function getModules(
  db,
  paginateBy = settings.paginateBy,
  page = 0,
  sort = settings.defaultSort
) {
  return db.get("modules").find(
    {},
    {
      skip: paginateBy * page,
      limit: paginateBy,
      sort
    }
  );
}

/**
 * Update name and description
 * @param {string} id - module's id
 * @param {{name: string, description: string}} params - module props
 * @param db - database client instance
 * @returns {Promise.<void>}
 */
async function updateModule(db, id, params) {
  return db
    .get("modules")
    .update(
      { _id: id },
      {
        $set: ensureSchema(params, moduleSchema, true)
      }
    )
    .then(r => r.ok === 1);
}

/**
 * Add fields to module and reloads all objects within this module
 * NOTE: resource-heavy
 * @param db - database client instance
 * @param {string} id - module's id
 * @param {Array.<{displayName: string, type: string}>} fields - fields models
 */
async function addModuleFields(db, id, fields) {
  const fieldsInModule = await getModule(id, db).then(m => m.fields);
  const fieldsToAdd = createModuleFields(fields);
  const fieldsModel = fieldsInModule.concat(fieldsToAdd);
  if (!ensureUnique(fieldsModel, "displayName")) {
    throw new Error("Given module fields model has duplicates");
  }
  return db.get("modules").update(
    { _id: id },
    {
      $set: {
        fields: fieldsModel
      }
    }
  );
}

/**
 * Removes module fields
 * @param db - database client instance
 * @param {string} id - module id
 * @param {Array<string>} fields - list of field names
 */
async function removeModuleFields(db, id, fields) {
  const fieldsInModule = await getModule(id, db).then(m => m.fields);
  const fieldsModel = fieldsInModule.filter(f => fields.includes(f.name));
  return db.get("modules").update(
    { _id: id },
    {
      $set: {
        fields: fieldsModel
      }
    }
  );
}

/**
 * Removes module
 * @param db - database client instance
 * @param {string} id
 */
async function removeModule(db, id) {
  return db
    .get("modules")
    .remove({ _id: id })
    .then(r => r.result.ok === 1);
}

module.exports = {
  addModule,
  addModuleFields,
  createModuleFields,
  getModule,
  getModules,
  updateModule,
  removeModule,
  removeModuleFields
};
