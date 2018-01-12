async function getContainer(id, db) {
  return db.get('containers')
    .findOne({ _id: id });
}

async function getContainerChildren(id, db) {
  return db.get('containers')
    .find({ parent_id: id });
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
    currentContainerId = r.parent_id;
    counter -= 1;
  }
  return breadcrumb.reverse();
}

async function addContainer(model, db) {
  const params = {
    created_at: +(new Date()),
  };
  return db.get('containers')
    .insert(Object.assign(params, model));
}

async function updateContainer(id, params, db) {
  return db.get('containers')
    .update({ _id: id }, {
      $set: {
        description: params.description,
        name: params.name,
        visible: params.visible,
        parent_id: params.parentId,
      },
    }).then(r => r.ok === 1);
}

async function removeContainer(id, db) {
  return db.get('containers')
    .remove({ _id: id })
    .then(r => r.result.ok === 1);
}

class Container {
  constructor(id, db) {
    this.init(id, db);
  }

  init(id, db) {
    this.db = db;

    getContainer(id, db)
      .then((model) => {
        if (model._id) {
          this.id = model._id;
          this.name = model.name;
          this.description = model.description;
          this.parentId = model.parent_id;
          this.visibility = model.visible;
          this.created_at = model.created_at;

          return true;
        }
        return new Error('Error finding container');
      });
  }

  getChildren() {
    return getContainerChildren(this.id, this.db);
  }

  getAncestors() {
    return getContainerAncestors(this.id, this.db);
  }

  async update(params) {
    const result = await updateContainer(this.id, params, this.db)
      .then(r => r.nMatched);

    if (result === 1) {
      Object.keys(params).forEach((key) => {
        this[key] = params[key];
      });
      return true;
    }
    return new Error('Error updating container');
  }

  async remove() {
    const result = await removeContainer(this.id, this.db)
      .then(r => r.nRemoved);

    if (result === 1) {
      this.id = undefined;
      this.name = undefined;
      this.description = undefined;
      this.parentId = undefined;
      this.visibility = undefined;
      this.created_at = undefined;

      return true;
    }
    return new Error('Failed to remove container');
  }
}

module.exports = {
  getContainer,
  getContainerChildren,
  getContainerAncestors,
  addContainer,
  removeContainer,
  updateContainer,
  Container,
};
