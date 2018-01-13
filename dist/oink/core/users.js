const auth = require('../auth');

async function getUser(id, db) {
  return db.get('users').findOne({ _id: id });
}

async function getUsers(db) {
  return db.get('users').find();
}

async function getUserRoles(id, acl) {
  return acl.userRoles(String(id));
}

async function addUser(model, db) {
  const params = {
    createdAt: +(new Date()),
  };
  return db.get('users').insert(Object.assign(params, model, auth.createPassword(model.pass)));
}

async function removeUser(id, db) {
  return db.get('users').remove({ _id: id });
}

async function addUserRole(id, role, acl) {
  return acl.addUserRoles(String(id), String(role));
}

async function removeUserRole(id, role, acl) {
  return acl.removeUserRoles(String(id), String(role));
}

async function isUserAllowed(id, resource, permission, acl) {
  return acl.isAllowed(String(id), String(resource), permission);
}

module.exports = {
  addUser,
  addUserRole,
  getUser,
  getUsers,
  getUserRoles,
  isUserAllowed,
  removeUser,
  removeUserRole,
};
