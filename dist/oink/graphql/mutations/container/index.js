const _NewContainer = require('./add');
const _RemoveContainer = require('./remove');
const _UpdateContainer = require('./update');

module.exports = ((db, acl, userId) => {
  const NewContainer = _NewContainer(db, acl, userId);
  const RemoveContainer = _RemoveContainer(db, acl, userId);
  const UpdateContainer = _UpdateContainer(db, acl, userId);
  return {
    NewContainer,
    RemoveContainer,
    UpdateContainer,
  };
});
