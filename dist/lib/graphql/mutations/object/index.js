const _New = require('./add');
const _Remove = require('./remove');
const _Update = require('./update');

module.exports = ((db, userId) => {
  const NewObject = _New(db, userId);
  const RemoveObject = _Remove(db, userId);
  const UpdateObject = _Update(db, userId);
  return {
    NewObject,
    RemoveObject,
    UpdateObject,
  };
});
