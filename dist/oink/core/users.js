const auth = require("../auth");

async function getUser(db, id) {
  return db.get("users").findOne({ _id: id });
}

async function getUsers(db, paginateBy, page, sort) {
  return db.get("users").find(
    {},
    {
      skip: paginateBy * page,
      limit: paginateBy,
      sort
    }
  );
}

async function getUserRoles(acl, id) {
  return acl.userRoles(String(id));
}

async function addUser(db, model) {
  const params = {
    createdAt: +new Date()
  };
  return db
    .get("users")
    .insert({ ...params, ...model, ...auth.createPassword(model.password) });
}

async function removeUser(db, id) {
  return db.get("users").remove({ _id: id });
}

async function addUserRole(acl, id, role) {
  return acl.addUserRoles(String(id), String(role));
}

async function removeUserRole(acl, id, role) {
  return acl.removeUserRoles(String(id), String(role));
}

async function isUserAllowed(acl, id, resource, permission) {
  return acl.isAllowed(String(id), String(resource), permission);
}

async function authenticateUser(db, login, password) {
  const user = await db.get("users").findOne({ login });
  return auth.checkPassword(password, user.password, user.salt);
}

module.exports = {
  addUser,
  addUserRole,
  authenticateUser,
  getUser,
  getUsers,
  getUserRoles,
  isUserAllowed,
  removeUser,
  removeUserRole
};
