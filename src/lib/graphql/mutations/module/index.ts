import _New from './add';
import _Remove from './remove';
import _Update from './update';

export default ((db) => {
  const NewModule = _New(db);
  const RemoveModule = _Remove(db);
  const UpdateModule = _Update(db);
  return {
    NewModule,
    RemoveModule,
    UpdateModule,
  };
});
