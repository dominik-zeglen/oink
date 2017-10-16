import _Containers from './multi';
import _Container from './single';

export default ((db) => {
  const Container = _Container(db);
  const Containers = _Containers(db);
  return {
    Container,
    Containers,
  };
});
