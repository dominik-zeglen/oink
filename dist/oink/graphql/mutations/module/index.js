const _New = require('./add');
const _AddFields = require('./addFields');
const _Remove = require('./remove');
const _Update = require('./update');

module.exports = ((db, acl, userId) => {
  const AddModuleFields = _AddFields(db, acl, userId);
  const NewModule = _New(db, acl, userId);
  const RemoveModule = _Remove(db, acl, userId);
  const UpdateModule = _Update(db, acl, userId);
  return {
    AddModuleFields,
    NewModule,
    RemoveModule,
    UpdateModule,
  };
});
