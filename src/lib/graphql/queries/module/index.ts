import _Module from './single';
import _Modules from './multi';

export default ((db) => {
  const Module = _Module(db);
  const Modules = _Modules(db);
  return {
    Module,
    Modules,
  };
});
