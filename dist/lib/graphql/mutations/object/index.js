const _New = require('./add');
const _Remove = require('./remove');
const _Update = require('./update');

module.exports = ((db) => {
  const NewObject = _New(db);
  const RemoveObject = _Remove(db);
  const UpdateObject = _Update(db);
  return {
    NewObject,
    RemoveObject,
    UpdateObject,
  };
});
