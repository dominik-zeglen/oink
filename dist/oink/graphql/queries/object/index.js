const _Object = require('./single');
const _Objects = require('./multi');

module.exports = ((db, acl, userId) => {
  const Object = _Object(db, acl, userId);
  const Objects = _Objects(db, acl, userId);
  return {
    Object,
    Objects,
  };
});
