const _container = require('./container');
const _module = require('./module');
const _object = require('./object');
const resolve = require('../../auth').resolveIfAllowed;


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

module.exports = ((db, acl, userId) => {
  return {
    ...secureByAcl(_container(db, acl, userId), acl, userId),
    ...secureByAcl(_module(db, acl, userId), acl, userId),
    ...secureByAcl(_object(db, acl, userId), acl, userId),
  };
});
