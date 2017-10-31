import _Module from './single';

export default ((db) => {
  const Module = _Module(db);
  return {
    Module,
  };
});
