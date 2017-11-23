const _container = require('./container');
const _module = require('./module');
const _object = require('./object');

module.exports = ((db) => {
  return {
    ..._container(db),
    ..._module(db),
    ..._object(db),
  };
});
