import _NewContainer from './add';
import _RemoveContainer from './remove';
import _UpdateContainer from './update';

export default ((db) => {
  const NewContainer = _NewContainer(db);
  const RemoveContainer = _RemoveContainer(db);
  const UpdateContainer = _UpdateContainer(db);
  return {
    NewContainer,
    RemoveContainer,
    UpdateContainer,
  };
});
