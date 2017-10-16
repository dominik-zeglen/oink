import _Fields from './multi';
import _Field from './single';

export default ((db) => {
  const Field = _Field(db);
  const Fields = _Fields(db);
  return {
    Field,
    Fields,
  };
});
