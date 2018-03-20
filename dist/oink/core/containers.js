const settings = require("../../../settings");
const { ensureSchema } = require("./utils");

const containerSchema = {
  name: {
    default: "New container",
    required: false,
    mutable: true
  },
  description: {
    default: "",
    required: false,
    mutable: true
  },
  parentId: {
    default: null,
    required: false,
    mutable: true
  },
  visible: {
    default: false,
    required: false,
    mutable: true
  }
};

/**
 * Adds container
 * @param db - database client instance
 * @param {{name: string, description: string, parentId: string, visible: boolean}} model - JSON containing container data
 */
async function addContainer(db, model) {
  const params = {
    createdAt: +new Date()
  };
  const validatedModel = ensureSchema(model, containerSchema);
  return db.get("containers").insert({ ...params, ...validatedModel });
}

/**
 * Returns container object
 * @param db - database client instance
 * @param {string} id - container's id
 */
async function getContainer(db, id) {
  if (id) {
    return db.get("containers").findOne({ _id: id });
  }
  return null;
}

/**
 * Returns container's children
 * @param db - database client instance
 * @param {string} id - container's id
 * @param {number} paginateBy - page size
 * @param {number} page - page number
 * @param {{field: string, order: number}} sort - sort model
 */
async function getContainerChildren(
  db,
  id,
  paginateBy = settings.paginateBy,
  page = 0,
  sort = settings.defaultSort,
  showHidden = false
) {
  return db.get("containers").find(
    { parentId: id, ...(showHidden ? {} : { visible: true }) },
    {
      skip: page * paginateBy,
      limit: paginateBy,
      sort
    }
  );
}

/**
 * Returns container's ancestors
 * @param db - database client instance
 * @param id - container's id
 */
async function getContainerAncestors(db, id, last = 10) {
  const breadcrumb = [];
  const maxDepth = last;

  let counter = maxDepth;
  let currentContainerId = id;
  while (counter > 0 && currentContainerId && currentContainerId !== "-1") {
    const r = await getContainer(db, currentContainerId);
    if (breadcrumb.map(p => String(p._id)).includes(String(r._id))) {
      return new Error("Cyclic inheritance chain");
    }
    breadcrumb.push(r);
    currentContainerId = r.parentId;
    counter -= 1;
  }
  return breadcrumb;
}

/**
 * Returns all containers
 * @param db - database client instance
 * @param {number} paginateBy - page size
 * @param {number} page - page number
 * @param {{field: string, order: number}} sort - sort model
 */
async function getContainerList(
  db,
  paginateBy = settings.paginateBy,
  page = 0,
  sort = settings.defaultSort,
  showHidden = false
) {
  return db.get("containers").find(showHidden ? {} : { visible: true }, {
    skip: page * paginateBy,
    limit: paginateBy,
    sort
  });
}

/**
 * Updates container
 * @param db - database client intance
 * @param {string} id - container's id
 * @param {{name: string, description: string, parentId: string, visible: boolean}} model - JSON containing container data
 */
async function updateContainer(db, id, params) {
  return db
    .get("containers")
    .update(
      { _id: id },
      {
        $set: ensureSchema(params, containerSchema, true)
      }
    )
    .then(r => r.ok === 1);
}

/**
 * Removes container
 * @param db - database client instance
 * @param {string} id - container's id
 */
async function removeContainer(db, id) {
  return db
    .get("containers")
    .remove({ _id: id })
    .then(r => r.result.ok === 1);
}

module.exports = {
  addContainer,
  getContainer,
  getContainerAncestors,
  getContainerChildren,
  getContainerList,
  removeContainer,
  updateContainer
};
