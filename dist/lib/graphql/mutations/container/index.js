const _NewContainer = require('./add');
const _RemoveContainer = require('./remove');
const _UpdateContainer = require('./update');

module.exports = ((db, userId) => {
  const NewContainer = _NewContainer(db, userId);
  const RemoveContainer = _RemoveContainer(db, userId);
  const UpdateContainer = _UpdateContainer(db, userId);
  return {
    NewContainer,
    RemoveContainer,
    UpdateContainer,
  };
});
