const _New = require('./add');
const _AddFields = require('./addFields');
const _Remove = require('./remove');
const _Update = require('./update');

module.exports = ((db) => {
  const AddModuleFields = _AddFields(db);
  const NewModule = _New(db);
  const RemoveModule = _Remove(db);
  const UpdateModule = _Update(db);
  return {
    AddModuleFields,
    NewModule,
    RemoveModule,
    UpdateModule,
  };
});
