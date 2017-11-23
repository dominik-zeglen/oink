const _Module = require('./single');
const _Modules = require('./multi');

module.exports = ((db, userId) => {
  const Module = _Module(db, userId);
  const Modules = _Modules(db, userId);
  return {
    Module,
    Modules,
  };
});
