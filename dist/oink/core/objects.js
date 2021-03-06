const { ensureSchema, ensureUnique } = require('./utils');
const objectModule = require('./object_modules');

const objectSchema = {
  name: {
    default: 'New object',
    required: false,
    mutable: true,
  },
  module: {
    default: '',
    required: true,
    mutable: false,
  },
  parentId: {
    default: '-1',
    required: false,
    mutable: true,
  },
  fields: {
    default: [],
    required: false,
    mutable: false,
  },
  visible: {
    default: false,
    required: false,
    mutable: true,
  },
};
const objectFieldSchema = {
  name: {
    default: '',
    required: true,
  },
  value: {
    default: '',
    required: false,
  },
};

function updateFields(src, patch) {
  const patchFields = patch.map(p => String(p.name));
  return src.map((f) => {
    const foundIndex = patchFields.indexOf(String(f.name));
    return foundIndex === -1 ? f : patch[foundIndex]
  });
}

async function addObject(model, db) {
  const validatedModel = ensureSchema(model, objectSchema);
  const fetchedModule = await objectModule.getModule(model.module, db);
  const moduleFields = fetchedModule.fields.map(f => String(f.name));

  if (model.fields && model.fields.length) {
    const modelFields = model.fields.map(f => String(f.name));
    const areFieldsUnique = ensureUnique(model.fields, 'name');
    if (!areFieldsUnique) {
      throw new Error('Object fields are not unique');
    }
    const areFieldsValidWithModuleSchema = model.fields.map(f => moduleFields.includes(String(f.name)))
      .reduce((p, v) => p && v);
    if (!areFieldsValidWithModuleSchema) {
      throw new Error('Object fields are not valid');
    }
    const areFieldsMissing = moduleFields.map(f => !modelFields.includes(String(f)))
      .reduce((p, v) => p && v);
    if (areFieldsMissing) {
      throw new Error('Object fields are missing');
    }
    validatedModel.fields = model.fields.map(f => ensureSchema(f, objectFieldSchema));
  } else {
    validatedModel.fields = moduleFields.map(f => ({
      name: f,
      value: objectFieldSchema.value.default,
    }));
  }

  return db.get('objects')
    .insert(validatedModel);
}

async function getObject(id, db) {
  return db.get('objects')
    .findOne({ _id: id });
}

async function getObjectsFromContainer(id, db) {
  return db.get('objects')
    .find({ parentId: id });
}

async function updateObject(id, params, db) {
  return db.get('objects')
    .update({ _id: id }, {
      $set: ensureSchema(params, objectSchema, true),
    }).then(r => r.ok === 1);
}

async function updateObjectFields(id, params, db) {
  const fetchedObjectFields = await getObject(id, db).then(o => o.fields);
  const updatedFields = updateFields(fetchedObjectFields, params)
    .map(f => ensureSchema(f, objectFieldSchema));
  if (updatedFields.length !== fetchedObjectFields.length) {
    throw new Error('Too many fields given');
  }
  return db.get('objects')
    .update({ _id: id }, {
      $set: {
        fields: updatedFields,
      },
    }).then(r => r.ok === 1);
}

async function removeObject(id, db) {
  return db.get('objects')
    .remove({ _id: id })
    .then(r => r.result.ok === 1);
}

module.exports = {
  addObject,
  getObject,
  getObjectsFromContainer,
  updateObject,
  updateObjectFields,
  removeObject,
};
