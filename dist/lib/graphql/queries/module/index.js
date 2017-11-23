const _Module = require('./single');
const _Modules = require('./multi');

module.exports = ((db) => {
  const Module = _Module(db);
  const Modules = _Modules(db);
  return {
    Module,
    Modules,
  };
});
