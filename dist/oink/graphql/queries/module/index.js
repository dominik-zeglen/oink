const _Module = require('./single');
const _Modules = require('./multi');

module.exports = ((db, acl, userId) => {
  const Module = _Module(db, acl, userId);
  const Modules = _Modules(db, acl, userId);
  return {
    Module,
    Modules,
  };
});
