import _New from './add';
import _Remove from './remove';

export default ((db) => {
  const NewObject = _New(db);
  const RemoveObject = _Remove(db);
  return {
    NewObject,
    RemoveObject,
  };
});
