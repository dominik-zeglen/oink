const _NewContainer = require('./add');
const _RemoveContainer = require('./remove');
const _UpdateContainer = require('./update');

module.exports = ((db) => {
  const NewContainer = _NewContainer(db);
  const RemoveContainer = _RemoveContainer(db);
  const UpdateContainer = _UpdateContainer(db);
  return {
    NewContainer,
    RemoveContainer,
    UpdateContainer,
  };
});
