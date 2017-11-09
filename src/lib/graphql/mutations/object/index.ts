import _New from './add';
import _Remove from './remove';
import _Update from './update';

export default ((db) => {
  const NewObject = _New(db);
  const RemoveObject = _Remove(db);
  const UpdateObject = _Update(db);
  return {
    NewObject,
    RemoveObject,
    UpdateObject,
  };
});
