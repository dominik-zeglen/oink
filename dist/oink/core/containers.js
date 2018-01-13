const { ensureSchema } = require('./utils');

const containerSchema = {
  name: {
    default: 'New container',
    required: false,
    mutable: true,
  },
  description: {
    default: '',
    required: false,
    mutable: true,
  },
  parentId: {
    default: '-1',
    required: false,
    mutable: true,
  },
  visible: {
    default: false,
    required: false,
    mutable: true,
  },
};

async function addContainer(model, db) {
  const params = {
    createdAt: +(new Date()),
  };
  const validatedModel = ensureSchema(model, containerSchema);
  return db.get('containers')
    .insert(Object.assign(params, validatedModel));
}

async function getContainer(id, db) {
  return db.get('containers')
    .findOne({ _id: id });
}

async function getContainerChildren(id, db) {
  return db.get('containers')
    .find({ parentId: id });
}

async function getContainerAncestors(id, db) {
  const breadcrumb = [];
  const maxDepth = 10;

  let counter = maxDepth;
  let currentContainerId = id;
  while (counter > 0 && currentContainerId && currentContainerId !== '-1') {
    const r = await getContainer(currentContainerId, db);
    if (breadcrumb.map(p => String(p._id)).includes(String(r._id))) {
      return new Error('Cyclic inheritance chain');
    }
    breadcrumb.push(r);
    currentContainerId = r.parentId;
    counter -= 1;
  }
  return breadcrumb.reverse();
}

async function updateContainer(id, params, db) {
  return db.get('containers')
    .update({ _id: id }, {
      $set: ensureSchema(params, containerSchema, true),
    }).then(r => r.ok === 1);
}

async function removeContainer(id, db) {
  return db.get('containers')
    .remove({ _id: id })
    .then(r => r.result.ok === 1);
}

module.exports = {
  getContainer,
  getContainerChildren,
  getContainerAncestors,
  addContainer,
  removeContainer,
  updateContainer,
};
