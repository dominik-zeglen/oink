import _ContainerObjectChildren from './children';
import _Object from './single';

export default ((db) => {
  const ContainerObjectChildren = _ContainerObjectChildren(db);
  const Object = _Object(db);
  return {
    ContainerObjectChildren,
    Object,
  };
});
