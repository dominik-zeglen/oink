import _New from './add';
import _Remove from './remove';

export default ((db) => {
  const NewModule = _New(db);
  const RemoveModule = _Remove(db);
  return {
    NewModule,
    RemoveModule,
  };
});
