const _Object = require('./single');
const _Objects = require('./multi');

module.exports = ((db) => {
  const Object = _Object(db);
  const Objects = _Objects(db);
  return {
    Object,
    Objects,
  };
});
