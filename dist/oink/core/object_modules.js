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

  if (!ensureUnique(model)) {
    throw new Error('Given module fields model has duplicates');
  }
  return model.map(field => ensureSchema(field, moduleFieldSchema))
    .map(field => Object.assign(field, {
      name: slug(field.displayName, slugOptions),
    }));
}

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

async function getModule(id, db) {
  return db.get('modules')
    .findOne({ _id: id });
}

async function getModules(db) {
  return db.get('modules')
    .find();
}

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
 * @param {Array.<{displayName: string, type: string}>} fields - array containing fields models
 * @param {Promise} db - database object
 * @type {Promise}
 */
async function addModuleFields(id, fields, db) {
  const fieldsInModule = await getModule(id, db).then(m => m.fields);
  const fieldsToAdd = createModuleFields(fields);
  const fieldsModel = fieldsInModule.concat(fieldsToAdd);
  if (!ensureUnique(fieldsModel)) {
    throw new Error('Given module fields model has duplicates');
  }
  return db.get('modules')
    .update({ _id: id }, {
      $set: {
        fields: fieldsModel,
      },
    });
}

async function removeModuleFields(id, fields, db) {
  const fieldsInModule = await getModule(id, db).then(m => m.fields);
  const fieldsModel = fieldsInModule.filter(f => !fields.includes(f.name));
  return db.get('modules')
    .update({ _id: id }, {
      $set: {
        fields: fieldsModel,
      },
    });
}

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
