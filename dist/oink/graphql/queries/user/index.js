const single = require('./single');
const multi = require('./multi');
const auth = require('./auth');

module.exports = ((db, acl, userId) => ({
  User: single(db, acl, userId),
  Users: multi(db, acl, userId),
  Auth: auth(db, acl, userId),
}));