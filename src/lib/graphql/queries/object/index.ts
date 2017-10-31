import _ContainerObjectChildren from './children';
import _Object from './single';

export default ((db) => {
  const Object = _Object(db);
  const ContainerObjectChildren = _ContainerObjectChildren(db);
  return {
    Object,
    ContainerObjectChildren,
  };
});
