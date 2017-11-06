import _New from './add';
import _AddFields from './addFields';
import _Remove from './remove';
import _Update from './update';

export default ((db) => {
  const AddModuleFields = _AddFields(db);
  const NewModule = _New(db);
  const RemoveModule = _Remove(db);
  const UpdateModule = _Update(db);
  return {
    AddModuleFields,
    NewModule,
    RemoveModule,
    UpdateModule,
  };
});
