const single = require('./single');
const multi = require('./multi');
const auth = require('./auth');
const current = require('./current');

module.exports = ((db, acl, userId) => ({
  User: single(db, acl, userId),
  Users: multi(db, acl, userId),
  Auth: auth(db, acl, userId),
  CurrentUser: current(db, acl, userId),
}));
