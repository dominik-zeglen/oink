const _Object = require('./single');
const _Objects = require('./multi');

module.exports = ((db, userId) => {
  const Object = _Object(db, userId);
  const Objects = _Objects(db, userId);
  return {
    Object,
    Objects,
  };
});
