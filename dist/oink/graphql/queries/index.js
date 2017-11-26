const _container = require('./container');
const _module = require('./module');
const _object = require('./object');

module.exports = ((db, acl, userId) => {
  return {
    ..._container(db, acl, userId),
    ..._module(db, acl, userId),
    ..._object(db, acl, userId),
  };
});
