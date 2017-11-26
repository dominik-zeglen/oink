const _ContainerBreadcrumb = require('./breadcrumb');
const _ContainerChildren = require('./children');
const _Container = require('./single');

module.exports = ((db, acl, userId) => {
  const Container = _Container(db, acl, userId);
  const ContainerBreadcrumb = _ContainerBreadcrumb(db, acl, userId);
  const ContainerChildren = _ContainerChildren(db, acl, userId);

  return {
    Container,
    ContainerBreadcrumb,
    ContainerChildren,
  };
});
