const _ContainerBreadcrumb = require('./breadcrumb');
const _ContainerChildren = require('./children');
const _Container = require('./single');

module.exports = ((db) => {
  const Container = _Container(db);
  const ContainerBreadcrumb = _ContainerBreadcrumb(db);
  const ContainerChildren = _ContainerChildren(db);

  return {
    Container,
    ContainerBreadcrumb,
    ContainerChildren,
  };
});
