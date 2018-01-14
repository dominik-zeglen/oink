const _New = require('./add');
const _Remove = require('./remove');
const _Update = require('./update');
const _UpdateFields = require('./updateFields');

module.exports = ((db, acl, userId) => {
  const NewObject = _New(db, acl, userId);
  const RemoveObject = _Remove(db, acl, userId);
  const UpdateObject = _Update(db, acl, userId);
  const UpdateObjectFields = _UpdateFields(db, acl, userId);
  return {
    NewObject,
    RemoveObject,
    UpdateObject,
    UpdateObjectFields,
  };
});
