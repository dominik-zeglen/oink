const _New = require('./add');
const _AddFields = require('./addFields');
const _Remove = require('./remove');
const _Update = require('./update');

module.exports = ((db, userId) => {
  const AddModuleFields = _AddFields(db, userId);
  const NewModule = _New(db, userId);
  const RemoveModule = _Remove(db, userId);
  const UpdateModule = _Update(db, userId);
  return {
    AddModuleFields,
    NewModule,
    RemoveModule,
    UpdateModule,
  };
});
