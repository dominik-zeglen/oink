const addUser = require('./add');
const removeUser = require('./remove');

module.exports = (db, acl, userId) => ({
  NewUser: addUser(db, acl, userId),
  RemoveUser: removeUser(db, acl, userId),
});
