const containerMutation = require('./container');
const moduleMutation = require('./module');
const objectMutation = require('./object');
const userMutation = require('./user');

module.exports = ((db, acl, userId) => ({
  ...containerMutation(db, acl, userId),
  ...moduleMutation(db, acl, userId),
  ...objectMutation(db, acl, userId),
  ...userMutation(db, acl, userId),
}));
