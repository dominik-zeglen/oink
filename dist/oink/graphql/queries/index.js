const _container = require('./container');
const _module = require('./module');
const _object = require('./object');


function secureByAcl(resourceList, acl, userId) {
  Object.keys(resourceList).map((key) => {
    const resource = resourceList[key];
    resource.resolve = resolve.bind({
      output: resource.resolve,
      acl: acl,
      userId: userId,
      resource: {
        name: 'graphql',
        permission: 'query'
      }
    });
  });
  return resourceList;
}

module.exports = ((db, acl, userId) => ({
  ..._container(db, acl, userId),
  ..._module(db, acl, userId),
  ..._object(db, acl, userId),
}));
