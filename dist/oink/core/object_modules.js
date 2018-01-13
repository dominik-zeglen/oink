const slug = require('slug');

const { ensureSchema, ensureUnique } = require('./utils');

const moduleSchema = {
  name: {
    default: 'New module',
    required: false,
    mutable: true,
  },
  description: {
    default: '',
    required: false,
    mutable: true,
  },
  fields: {
    default: [],
    required: false,
    mutable: false,
  },
};
const moduleFieldSchema = {
  displayName: {
    default: '',
    required: true,
  },
  type: {
    default: '',
    required: true,
  },
};

function createModuleFields(model) {
  const slugOptions = {
    replacement: '_',
    lower: true,
  };

  if (!ensureUnique(model, 'displayName')) {
    throw new Error('Given module fields model has duplicates');
  }
  return model.map(field => ensureSchema(field, moduleFieldSchema))
    .map(field => Object.assign(field, {
      name: slug(field.displayName, slugOptions),
    }));
}

/**
 * Add new module to site
 * @param {{name: string, description: string, fields: Array<{displayName: string, type: string}>}} model - Module model containing all needed data
 * @param db
 * @returns {Promise.<void>}
 */
async function addModule(model, db) {
  const params = {
    createdAt: +(new Date()),
  };
  const validatedModel = ensureSchema(model, moduleSchema);
  if (validatedModel.fields.length) {
    validatedModel.fields = createModuleFields(validatedModel.fields);
  }
  return db.get('modules')
    .insert(Object.assign(params, validatedModel));
}

/**
 * Get module by it's ID
 * @param {string} id - ID of wanted module
 * @param {Promise} db - Database object
 * @returns {Promise.<Promise|*|Promise<any | T>>}
 */
async function getModule(id, db) {
  return db.get('modules')
    .findOne({ _id: id });
}

/**
 * Get list of available modules
 * @param {Promise} db - Database object
 * @returns {Promise.<void>}
 */
async function getModules(db) {
  return db.get('modules')
    .find();
}

/**
 * Update name and description
 * @param {string} id - ID of modified module
 * @param {{name: string, description: string}} params - Object props object
 * @param {Promise} db - Database object
 * @returns {Promise.<void>}
 */
async function updateModule(id, params, db) {
  return db.get('modules')
    .update({ _id: id }, {
      $set: ensureSchema(params, moduleSchema, true),
    }).then(r => r.ok === 1);
}

/**
 * Add fields to module and reloads all objects within this module
 * NOTE: resource-heavy
 * @constructor
 * @param {string} id - ID of modified module
 * @param {Array.<{displayName: string, type: string}>} fields - Array containing fields models
 * @param {Promise} db - Database object
 * @type {Promise.<void>}
 */
async function addModuleFields(id, fields, db) {
  const fieldsInModule = await getModule(id, db).then(m => m.fields);
  const fieldsToAdd = createModuleFields(fields);
  const fieldsModel = fieldsInModule.concat(fieldsToAdd);
  if (!ensureUnique(fieldsModel, 'displayName')) {
    throw new Error('Given module fields model has duplicates');
  }
  return db.get('modules')
    .update({ _id: id }, {
      $set: {
        fields: fieldsModel,
      },
    });
}

/**
 * Remove module fields
 * @param {string} id - Module ID
 * @param {Array<string>} fields - list of field names (not displayNames)
 * @param {Promise} db - Database object
 * @returns {Promise.<void>}
 */
async function removeModuleFields(id, fields, db) {
  const fieldsInModule = await getModule(id, db).then(m => m.fields);
  const fieldsModel = fieldsInModule.filter(f => fields.includes(f.name));
  return db.get('modules')
    .update({ _id: id }, {
      $set: {
        fields: fieldsModel,
      },
    });
}

/**
 * Remove module from site
 * @param {string} id
 * @param {Promise} db - Database object
 * @returns {Promise.<boolean>}
 */
async function removeModule(id, db) {
  return db.get('modules')
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
  removeModuleFields,
};
