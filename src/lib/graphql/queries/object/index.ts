import _Object from './single';
import _Objects from './multi';

export default ((db) => {
  const Object = _Object(db);
  const Objects = _Objects(db);
  return {
    Object,
    Objects,
  };
});
