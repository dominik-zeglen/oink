const auth = require('../auth');

async function getUser(id, db) {
  return db.get('users').findOne({ _id: id });
}

async function getUsers(db) {
  return db.get('users').find();
}

async function getUserRoles(id, acl) {
  return acl.userRoles(id);
}

async function addUser(model, db) {
  const params = {
    created_at: +(new Date()),
  };
  return db.get('users').insert(Object.assign(params, model, auth.createPassword(model.pass)));
}

async function removeUser(id, db) {
  return db.get('users').remove({ _id: id });
}

async function addRole(id, role, acl) {
  return acl.addUserRoles(id, role);
}

async function removeRole(id, role, acl) {
  return acl.removeUserRoles(id, role);
}

async function isAllowed(id, resource, permission, acl) {
  return acl.isAllowed(id, resource, permission);
}

class User {
  constructor(id, db, acl) {
    getUser(id, db)
      .then((model) => {
        this.login = model.login;
        this.name = model.name;
        this.created_at = model.created_at;
        getUserRoles(id, acl).then((roles) => {
          this.roles = roles;
        });
      });
  }
}

module.exports = {
  getUser,
  getUsers,
  getUserRoles,
  addUser,
  removeUser,
  User,
};
