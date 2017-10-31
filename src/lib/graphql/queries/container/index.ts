import _ContainerBreadcrumb from './breadcrumb';
import _ContainerChildren from './children';
import _Container from './single';

export default ((db) => {
  const Container = _Container(db);
  const ContainerBreadcrumb = _ContainerBreadcrumb(db);
  const ContainerChildren = _ContainerChildren(db);

  return {
    Container,
    ContainerBreadcrumb,
    ContainerChildren,
  };
});
