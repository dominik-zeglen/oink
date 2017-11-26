const _New = require('./add');
const _Remove = require('./remove');
const _Update = require('./update');

module.exports = ((db, acl, userId) => {
  const NewObject = _New(db, acl, userId);
  const RemoveObject = _Remove(db, acl, userId);
  const UpdateObject = _Update(db, acl, userId);
  return {
    NewObject,
    RemoveObject,
    UpdateObject,
  };
});
