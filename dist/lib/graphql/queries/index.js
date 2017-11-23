const _container = require('./container');
const _module = require('./module');
const _object = require('./object');

module.exports = ((db, userId) => {
  return {
    ..._container(db, userId),
    ..._module(db, userId),
    ..._object(db, userId),
  };
});
